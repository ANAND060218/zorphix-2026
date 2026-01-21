import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { FaGoogle, FaUserTie, FaUniversity, FaBuilding, FaPhone, FaCheckCircle, FaBriefcase, FaChartLine, FaSignOutAlt, FaWallet, FaCoins, FaDownload, FaPen, FaEnvelope } from 'react-icons/fa';
import * as htmlToImage from 'html-to-image';
import CoinBackground from './CoinBackground';
import CurrencyBackground from './CurrencyBackground';
import toast from 'react-hot-toast';
import { technicalEvents, workshops, paperPresentation } from '../data/events';
import { QRCodeSVG } from 'qrcode.react';
import UserQueries from './UserQueries';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [registeredEventsList, setRegisteredEventsList] = useState([]);
    const ticketRef = useRef(null);

    // Combine all events for lookup
    const allEvents = [...technicalEvents, ...workshops, ...paperPresentation];

    const [formData, setFormData] = useState({
        name: '',
        college: '',
        collegeOther: '',
        degree: '',
        degreeOther: '',
        department: '',
        departmentOther: '',
        year: '1',
        phone: ''
    });

    const [errors, setErrors] = useState({});

    // College Search State
    const [collegeSearch, setCollegeSearch] = useState('');
    const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);

    // Dropdown options
    const yearOptions = [
        { value: "1", label: "Year 1" },
        { value: "2", label: "Year 2" },
        { value: "3", label: "Year 3" },
        { value: "4", label: "Year 4" }
    ];

    const degreeOptions = [
        { value: "B.Tech", label: "B.Tech" },
        { value: "B.E", label: "B.E" },
        { value: "B.Sc", label: "B.Sc" },
        { value: "B.Com", label: "B.Com" },
        { value: "B.Arch", label: "B.Arch" },
        { value: "M.Tech", label: "M.Tech" },
        { value: "M.E", label: "M.E" },
        { value: "MBA", label: "MBA" },
        { value: "MCA", label: "MCA" },
        { value: "Other", label: "Other" }
    ];

    const departmentOptions = [
        { value: "Artificial Intelligence and Data Science", label: "Artificial Intelligence and Data Science" },
        { value: "Biomedical Engineering", label: "Biomedical Engineering" },
        { value: "Chemical Engineering", label: "Chemical Engineering" },
        { value: "Civil Engineering", label: "Civil Engineering" },
        { value: "Computer Science and Business Systems", label: "Computer Science and Business Systems" },
        { value: "Computer Science and Design", label: "Computer Science and Design" },
        { value: "Computer Science and Engineering", label: "Computer Science and Engineering" },
        { value: "CSE (AI & ML)", label: "CSE (Artificial Intelligence and Machine Learning)" },
        { value: "CSE (Cyber Security)", label: "CSE (Cyber Security)" },
        { value: "Electrical and Electronics Engineering", label: "Electrical and Electronics Engineering" },
        { value: "Electronics and Communication Engineering", label: "Electronics and Communication Engineering" },
        { value: "Mechanical Engineering", label: "Mechanical Engineering" },
        { value: "Mechatronics Engineering", label: "Mechatronics Engineering" },
        { value: "Information Technology", label: "Information Technology" },
        { value: "Other", label: "Other" }
    ];

    const collegeOptions = [
        { value: "1", label: "University Departments of Anna University Chennai - CEG Campus" },
        { value: "2", label: "University Departments of Anna University Chennai - ACT Campus" },
        { value: "3", label: "School of Architecture and Planning Anna University" },
        { value: "4", label: "University Departments of Anna University Chennai - MIT Campus" },
        { value: "5", label: "Annamalai University Faculty of Engineering and Technology" },
        { value: "c1", label: "Indian Institute of Information Technology Design & Manufacturing" },
        { value: "c2", label: "Indian Institute of Information Technology Tiruchirappalli" },
        { value: "c3", label: "Indian Institute of Technology Madras" },
        { value: "c4", label: "National Institute of Technology, Tiruchirappalli" },
        { value: "1d", label: "Academy of Maritime Education and Training" },
        { value: "2d", label: "Amrita Vishwa Vidyapeetham" },
        { value: "3d", label: "Avinashilingam Institute for Home Science & Higher Education for Women" },
        { value: "4d", label: "Bharath Institute of Higher Education & Research" },
        { value: "5d", label: "Chennai Mathematical Institute" },
        { value: "6d", label: "Chettinad Academy of Research and Education (CARE)" },
        { value: "7d", label: "Dr. M.G.R. Educational and Research Institute" },
        { value: "8d", label: "Hindustan Institute of Technology and Science (HITS)" },
        { value: "9d", label: "Kalasalingam Academy of Research and Education" },
        { value: "10d", label: "Karpagam Academy of Higher Education" },
        { value: "11d", label: "Karunya Institute of Technology and Sciences" },
        { value: "12d", label: "Meenakshi Academy of Higher Education and Research" },
        { value: "13d", label: "Noorul Islam Centre for Higher Education" },
        { value: "14d", label: "Periyar Maniammai Institute of Science & Technology" },
        { value: "15d", label: "Ponnaiyah Ramajayam Institute of Science & technology (PMIST)" },
        { value: "16d", label: "S.R.M. Institute of Science and Technology" },
        { value: "17d", label: "Sathyabama Institute of Science and Technology" },
        { value: "18d", label: "Saveetha Institute of Medical and Technical Sciences" },
        { value: "19d", label: "Shanmugha Arts, Science, Technology & Research Academy (SASTRA)" },
        { value: "20d", label: "Sri Chandrasekharandra Saraswati Vishwa Mahavidyalaya" },
        { value: "21d", label: "Sri Ramachandra Institute of Higher Education and Research" },
        { value: "22d", label: "St. Peter's Institute of Higher Education and Research" },
        { value: "23d", label: "The Gandhigram Rural Institute" },
        { value: "24d", label: "Vel Tech Rangarajan Dr Sagunthala R&D Institute of Science & Technology" },
        { value: "25d", label: "Vellore Institute of Technology" },
        { value: "26d", label: "Vels Institute of Science, Technology & Advanced Studies (VISTAS)" },
        { value: "27d", label: "Vinayaka Mission's Research Foundation" },
        { value: "1013", label: "University College of Engineering Villupuram" },
        { value: "1014", label: "University College of Engineering Tindivanam" },
        { value: "1015", label: "University College of Engineering Arni" },
        { value: "1026", label: "University College of Engineering Kancheepuram" },
        { value: "1101", label: "Aalim Muhammed Salegh College of Engineering" },
        { value: "1106", label: "Jaya Engineering College" },
        { value: "1107", label: "Jaya Institute of Technology" },
        { value: "1110", label: "Prathyusha Engineering college (Autonomous)" },
        { value: "1112", label: "R M D Engineering College (Autonomous)" },
        { value: "1113", label: "R M Engineering College (Autonomous)" },
        { value: "1114", label: "S A Engineering College (Autonomous)" },
        { value: "1115", label: "Sri Ram Engineering College" },
        { value: "1116", label: "Sri Venkateswara College of Engineering and Technology" },
        { value: "1118", label: "Vel Tech Multi Tech Dr. Rangarajan Dr. Sakunthala Engineering College (Autonomous)" },
        { value: "1120", label: "Velammal Engineering College (Autonomous)" },
        { value: "1121", label: "Sri Venkateswara Institute of Science and Technology" },
        { value: "1122", label: "Vel Tech High Tech Dr. Rangarajan Dr. Sakunthala Engineering College (Autonomous)" },
        { value: "1123", label: "Gojan School of Business and Technology" },
        { value: "1124", label: "SAMS College of Engineering and Technology" },
        { value: "1125", label: "PMR Engineering College" },
        { value: "1126", label: "J N N Institute of Engineering (Autonomous)" },
        { value: "1127", label: "St. Peters College of Engineering and Technology" },
        { value: "1128", label: "R M K College of Engineering and Technology (Autonomous)" },
        { value: "1133", label: "Annai Veilankannis College of Engineering" },
        { value: "1137", label: "Annai Mira College of Engineering and Technology" },
        { value: "1140", label: "Jeppiaar Institute of Technology" },
        { value: "1149", label: "St. Joseph's Institute of Technology (Autonomous)" },
        { value: "1150", label: "Sri Jayaram Institute of Engineering and Technology" },
        { value: "1202", label: "D M I College of Engineering" },
        { value: "1207", label: "Kings Engineering College" },
        { value: "1209", label: "Pallavan College of Engineering" },
        { value: "1210", label: "Panimalar Engineering College (Autonomous)" },
        { value: "1211", label: "Rajalakshmi Engineering College (Autonomous)" },
        { value: "1212", label: "Rajiv Gandhi College of Engineering" },
        { value: "1213", label: "S K R Engineering College" },
        { value: "1216", label: "Saveetha Engineering College (Autonomous)" },
        { value: "1217", label: "Sree Sastha Institute of Engineering and Technology" },
        { value: "1218", label: "Sri Muthukumaran Institute of Technology" },
        { value: "1219", label: "Sri Venkateswara College of Engineering (Autonomous)" },
        { value: "1221", label: "Jaya College of Engineering and Technology" },
        { value: "1222", label: "P B College of Engineering" },
        { value: "1225", label: "Loyola Institute of Technology" },
        { value: "1226", label: "P T Lee Chengalvaraya Naicker College of Engineering and Technology" },
        { value: "1228", label: "Alpha College of Engineering" },
        { value: "1229", label: "Indira Institute of Engineering and Technology" },
        { value: "1230", label: "Apollo Engineering College" },
        { value: "1232", label: "A R M College of Engineering and Technology" },
        { value: "1233", label: "Adhi College of Engineering and Technology" },
        { value: "1235", label: "Jei Mathaajee College of Engineering" },
        { value: "1237", label: "Velammal Institute of Technology" },
        { value: "1238", label: "G R T Institute of Engineering and Technology" },
        { value: "1241", label: "T J S Engineering College" },
        { value: "1243", label: "Madha Institute of Engineering and Technology" },
        { value: "1301", label: "Mohammed Sathak A J College of Engineering" },
        { value: "1303", label: "Anand Institute of Higher Technology" },
        { value: "1304", label: "Easwari Engineering College (Autonomous)" },
        { value: "1306", label: "Jeppiaar Engineering College" },
        { value: "1307", label: "Jerusalem College of Engineering (Autonomous)" },
        { value: "1309", label: "Meenakshi Sundararajan Engineering College" },
        { value: "1310", label: "Misrimal Navajee Munoth Jain Engineering College" },
        { value: "1311", label: "K C G College of Technology (Autonomous)" },
        { value: "1313", label: "Shree Motilal Kanhaiyalal (SMK) Fomra Institute of Technology" },
        { value: "1315", label: "Sri Sivasubramaniya Nadar College of Engineering (Autonomous)" },
        { value: "1316", label: "Agni College of Technology" },
        { value: "1317", label: "St. Joseph's College of Engineering (Autonomous)" },
        { value: "1318", label: "T.J Institute of Technology" },
        { value: "1319", label: "Thangavelu Engineering College" },
        { value: "1321", label: "Central Institute of Petrochemicals Engineering and Technology (CIPET)" },
        { value: "1322", label: "Dhanalakshmi Srinivasan College of Engineering and Technology" },
        { value: "1324", label: "Sri Sai Ram Institute of Technology (Autonomous)" },
        { value: "1325", label: "St. Joseph College of Engineering" },
        { value: "1334", label: "ARS College of Engineering" },
        { value: "1335", label: "Sri Krishna Institute of Technology" },
        { value: "1398", label: "Chennai Institute of Technology and Applied Research" },
        { value: "1399", label: "Chennai Institute of Technology (Autonomous)" },
        { value: "1401", label: "Adhiparasakthi Engineering College" },
        { value: "1402", label: "Annai Teresa College of Engineering" },
        { value: "1405", label: "Dhanalakshmi College of Engineering" },
        { value: "1407", label: "G K M College of Engineering and Technology" },
        { value: "1408", label: "I F E T College of Engineering (Autonomous)" },
        { value: "1409", label: "Karpaga Vinayaga College of Engineering and Technology" },
        { value: "1411", label: "Madha Engineering College" },
        { value: "1412", label: "Mailam Engineering College" },
        { value: "1413", label: "Sri Venkateswaraa College of Technology" },
        { value: "1414", label: "Prince Shri Venkateshwara Padmavathy Engineering College (Autonomous)" },
        { value: "1415", label: "T S M Jain College of Technology" },
        { value: "1416", label: "Jaya Sakthi Engineering College" },
        { value: "1419", label: "Sri Sai Ram Engineering College (Autonomous)" },
        { value: "1420", label: "Tagore Engineering College" },
        { value: "1421", label: "V R S College of Engineering and Technology" },
        { value: "1422", label: "SRM Valliammai Engineering College (Autonomous)" },
        { value: "1423", label: "Asan Memorial College of Engineering and Technology" },
        { value: "1424", label: "Dhaanish Ahmed College of Engineering" },
        { value: "1426", label: "Sri Ramanujar Engineering College" },
        { value: "1427", label: "Sri Krishna Engineering College" },
        { value: "1428", label: "E S College of Engineering and Technology" },
        { value: "1430", label: "Maha Bharathi Engineering College" },
        { value: "1431", label: "New Prince Shri Bhavani College of Engineering and Technology (Autonomous)" },
        { value: "1432", label: "Rajalakshmi Institute of Technology (Autonomous)" },
        { value: "1434", label: "Surya Group of Institutions" },
        { value: "1436", label: "A R Engineering College" },
        { value: "1437", label: "Rrase College of Engineering" },
        { value: "1438", label: "Sree Krishna College of Engineering" },
        { value: "1441", label: "A K T Memorial College of Engineering and Technology" },
        { value: "1442", label: "Prince Dr. K Vasudevan College of Engineering and Technology" },
        { value: "1444", label: "Chendu College of Engineering and Technology" },
        { value: "1445", label: "Sri Rangapoopathi College of Engineering" },
        { value: "1449", label: "Saraswathy College of Engineering and Technology" },
        { value: "1450", label: "Loyola ICAM College of Engineering and Technology" },
        { value: "1452", label: "PERI Institute of Technology" },
        { value: "1501", label: "Adhiparasakthi College of Engineering" },
        { value: "1503", label: "Arulmigu Meenakshi Amman College of Engineering" },
        { value: "1504", label: "Arunai Engineering College" },
        { value: "1505", label: "C Abdul Hakeem College of Engineering and Technology" },
        { value: "1507", label: "Ganadipathy Tulsi's Jain Engineering College" },
        { value: "1509", label: "Meenakshi College of Engineering" },
        { value: "1510", label: "Priyadarshini Engineering College" },
        { value: "1511", label: "Ranipettai Engineering College" },
        { value: "1512", label: "S K P Engineering College" },
        { value: "1513", label: "Sri Balaji Chockalingam Engineering College" },
        { value: "1514", label: "Sri Nandhanam College of Engineering and Technology" },
        { value: "1516", label: "Thanthai Periyar Government Institute of Technology" },
        { value: "1517", label: "Thirumalai Engineering College" },
        { value: "1518", label: "Thiruvalluvar College of Engineering and Technology" },
        { value: "1519", label: "Bharathidasan Engineering College" },
        { value: "1520", label: "Kingston Engineering College" },
        { value: "1523", label: "Global Institute of Engineering and Technology" },
        { value: "1524", label: "Annamalaiar College of Engineering" },
        { value: "1525", label: "Podhigai College of Engineering and Technology" },
        { value: "1526", label: "Sri Krishna College of Engineering" },
        { value: "1529", label: "Oxford College of Engineering" },
        { value: "1605", label: "Idhaya Engineering College for Women" },
        { value: "2005", label: "Government College of Technology (Autonomous), Coimbatore" },
        { value: "2006", label: "PSG College of Technology (Autonomous)" },
        { value: "2007", label: "Coimbatore Institute of Technology (Autonomous)" },
        { value: "2025", label: "Anna University Regional Campus - Coimbatore" },
        { value: "2302", label: "Sri Shanmugha College of Engineering and Technology" },
        { value: "2314", label: "Muthayammal College of Engineering" },
        { value: "2327", label: "N S N College of Engineering and Technology" },
        { value: "2328", label: "K S R Institute for Engineering and Technology (Autonomous)" },
        { value: "2329", label: "Rathinam Technical Campus (Autonomous)" },
        { value: "2332", label: "Aishwarya College of Engineering and Technology" },
        { value: "2338", label: "Asian College of Engineering and Technology" },
        { value: "2341", label: "Ganesh College of Engineering" },
        { value: "2342", label: "Sri Ranganathar Institute of Engineering and Technology" },
        { value: "2343", label: "Indian Institute of Handloom Technology" },
        { value: "2345", label: "Dhirajlal Gandhi College of Technology" },
        { value: "2346", label: "Shree Sathyam College of Engineering and Technology" },
        { value: "2347", label: "AVS College of Technology" },
        { value: "2349", label: "Dhaanish Ahmed Institute of Technology" },
        { value: "2350", label: "Jairupaa College of Engineering" },
        { value: "2354", label: "Pollachi Institute of Engineering and Technology" },
        { value: "2356", label: "Arulmurugan College of Engineering" },
        { value: "2357", label: "V S B College of Engineering Technical Campus" },
        { value: "2360", label: "Suguna College of Engineering" },
        { value: "2367", label: "Arjun College of Technology" },
        { value: "2368", label: "Vishnu Lakshmi College of Engineering and Technology" },
        { value: "2369", label: "Government College of Engineering Dharmapuri" },
        { value: "2377", label: "PSG Institute of Technology and Applied Research" },
        { value: "2378", label: "Cherraan College of Technology" },
        { value: "2601", label: "Adhiyamaan College of Engineering (Autonomous)" },
        { value: "2602", label: "Annai Mathammal Sheela Engineering College" },
        { value: "2603", label: "Government College of Engineering (Autonomous) Bargur Krishnagiri District" },
        { value: "2607", label: "K S Rangasamy College of Technology (Autonomous)" },
        { value: "2608", label: "M Kumarasamy College of Engineering (Autonomous)" },
        { value: "2609", label: "Mahendra Engineering College (Autonomous)" },
        { value: "2610", label: "Muthayammal Engineering College (Autonomous)" },
        { value: "2611", label: "Paavai Engineering College (Autonomous)" },
        { value: "2612", label: "P G P College of Engineering and Technology" },
        { value: "2613", label: "K S R College of Engineering (Autonomous)" },
        { value: "2614", label: "S S M College of Engineering" },
        { value: "2615", label: "Government College of Engineering (Autonomous) Karuppur Salem District" },
        { value: "2616", label: "Sapthagiri College of Engineering" },
        { value: "2617", label: "Sengunthar Engineering College (Autonomous)" },
        { value: "2618", label: "Sona College of Technology (Autonomous)" },
        { value: "2620", label: "Vivekanandha College of Engineering for Women (Autonomous)" },
        { value: "2621", label: "Er. Perumal Manimekalai College of Engineering (Autonomous)" },
        { value: "2622", label: "V S B Engineering College (Autonomous)" },
        { value: "2623", label: "Mahendra College of Engineering" },
        { value: "2624", label: "Gnanamani College of Technology (Autonomous)" },
        { value: "2625", label: "The Kavery Engineering College" },
        { value: "2627", label: "Selvam College of Technology" },
        { value: "2628", label: "Paavai College of Engineering" },
        { value: "2630", label: "Chettinad College of Engineering and Technology" },
        { value: "2632", label: "Mahendra Institute of Technology (Autonomous)" },
        { value: "2633", label: "Vidyaa Vikas College of Engineering and Technology" },
        { value: "2634", label: "Excel Engineering College (Autonomous)" },
        { value: "2635", label: "CMS College of Engineering" },
        { value: "2636", label: "A V S Engineering College" },
        { value: "2638", label: "Mahendra Engineering College for Women" },
        { value: "2639", label: "R P Sarathy Institute of Technology" },
        { value: "2640", label: "Jayalakshmi Institute of Technology" },
        { value: "2641", label: "Varuvan Vadivelan Institute of Technology" },
        { value: "2642", label: "P S V College of Engineering and Technology" },
        { value: "2643", label: "Bharathiyar Institute of Engineering for Women" },
        { value: "2646", label: "Tagore Institute of Engineering and Technology" },
        { value: "2647", label: "J K K Nataraja College of Engineering and Technology" },
        { value: "2648", label: "Annapoorana Engineering College (Autonomous)" },
        { value: "2650", label: "Christ The King Engineering College" },
        { value: "2651", label: "Jai Shriram Engineering College" },
        { value: "2652", label: "AL-Ameen Engineering College (Autonomous)" },
        { value: "2653", label: "Knowledge Institute of Technology (Autonomous) KIOT Campus" },
        { value: "2656", label: "Builders Engineering College" },
        { value: "2658", label: "V S A Group of Institutions" },
        { value: "2659", label: "Salem College of Engineering and Technology" },
        { value: "2661", label: "Vivekanandha College of Technology for Women" },
        { value: "2673", label: "Sree Sakthi Engineering College" },
        { value: "2683", label: "Shreenivasa Engineering College" },
        { value: "2702", label: "Bannari Amman Institute of Technology (Autonomous)" },
        { value: "2704", label: "Coimbatore Institute of Engineering and Technology (Autonomous)" },
        { value: "2705", label: "CSI College of Engineering" },
        { value: "2706", label: "Dr. Mahalingam College of Engineering and Technology (Autonomous)" },
        { value: "2707", label: "Erode Sengunthar Engineering College (Autonomous)" },
        { value: "2708", label: "Hindusthan College of Engineering and Technology (Autonomous)" },
        { value: "2709", label: "Government College of Engineering (Formerly IRTT)" },
        { value: "2710", label: "Karpagam College of Engineering (Autonomous)" },
        { value: "2711", label: "Kongu Engineering College (Autonomous)" },
        { value: "2712", label: "Kumaraguru College of Technology (Autonomous)" },
        { value: "2713", label: "M P Nachimuthu M Jaganathan Engineering College" },
        { value: "2715", label: "Nandha Engineering College (Autonomous)" },
        { value: "2716", label: "Park College of Engineering and Technology" },
        { value: "2717", label: "Sasurie College of Engineering" },
        { value: "2718", label: "Sri Krishna College of Engineering and Technology (Autonomous)" },
        { value: "2719", label: "Sri Ramakrishna Engineering College (Autonomous)" },
        { value: "2721", label: "Tamilnadu College of Engineering Karumathampatti" },
        { value: "2722", label: "Sri Krishna College of Technology (Autonomous)" },
        { value: "2723", label: "Velalar College of Engineering and Technology (Autonomous)" },
        { value: "2725", label: "Sri Ramakrishna Institute of Technology (Autonomous)" },
        { value: "2726", label: "SNS College of Technology (Autonomous)" },
        { value: "2727", label: "Sri Shakthi Institute of Engineering and Technology (Autonomous)" },
        { value: "2729", label: "Nehru Institute of Engineering and Technology" },
        { value: "2731", label: "R V S College of Engineering and Technology" },
        { value: "2732", label: "Info Institute of Engineering" },
        { value: "2733", label: "Angel College of Engineering and Technology" },
        { value: "2734", label: "SNS College of Engineering (Autonomous)" },
        { value: "2735", label: "Karpagam Institute of Technology" },
        { value: "2736", label: "Dr. N G P Institute of Technology (Autonomous)" },
        { value: "2737", label: "Sri Sai Ranganathan Engineering College" },
        { value: "2739", label: "Sri Eshwar College of Engineering (Autonomous)" },
        { value: "2740", label: "Hindusthan Institute of Technology (Autonomous)" },
        { value: "2741", label: "P A College of Engineering and Technology (Autonomous)" },
        { value: "2743", label: "Dhanalakshmi Srinivasan College of Engineering (CBE)" },
        { value: "2744", label: "Adithya Institute of Technology" },
        { value: "2745", label: "Kathir College of Engineering" },
        { value: "2747", label: "Shree Venkateshwara Hi-Tech Engineering College (Autonomous)" },
        { value: "2748", label: "Surya Engineering College" },
        { value: "2749", label: "Easa College of Engineering and Technology" },
        { value: "2750", label: "KIT - Kalaignar Karunanidhi Institute of Technology (Autonomous)" },
        { value: "2751", label: "KGISL Institute of Technology KGISL Campus" },
        { value: "2752", label: "Nandha College of Technology" },
        { value: "2753", label: "PPG Institute of Technology" },
        { value: "2755", label: "Nehru Institute of Technology (Autonomous)" },
        { value: "2758", label: "J K K Munirajah College of Technology" },
        { value: "2761", label: "United Institute of Technology" },
        { value: "2762", label: "Jansons Institute of Technology" },
        { value: "2763", label: "Akshaya College of Engineering and Technology" },
        { value: "2764", label: "K P R Institute of Engineering and Technology (Autonomous)" },
        { value: "2767", label: "SRG Engineering College" },
        { value: "2768", label: "Park College of Technology" },
        { value: "2769", label: "J C T College of Engineering and Technology" },
        { value: "2770", label: "Studyworld College of Engineering" },
        { value: "2772", label: "C M S College of Engineering and Technology" },
        { value: "2776", label: "R V S Technical Campus-Coimbatore" },
        { value: "3011", label: "University College of Engineering Tiruchirappalli" },
        { value: "3016", label: "University College of Engineering Ariyalur" },
        { value: "3018", label: "University College of Engineering Nagappattinam" },
        { value: "3019", label: "University College of Engineering Kumbakonam" },
        { value: "3021", label: "University College of Engineering Thanjavur" },
        { value: "3403", label: "Mahalakshmi Engineering College Trichy-Salem" },
        { value: "3410", label: "Krishnasamy College of Engineering and Technology" },
        { value: "3425", label: "C K College of Engineering and Technology" },
        { value: "3454", label: "Sri Ramakrishna College of Engineering" },
        { value: "3456", label: "K S K College of Engineering and Technology" },
        { value: "3460", label: "Surya College of Engineering" },
        { value: "3461", label: "Arifa Institute of Technology" },
        { value: "3462", label: "Ariyalur Engineering College" },
        { value: "3464", label: "Government College of Engineering Gandarvakotta" },
        { value: "3465", label: "Government College of Engineering Srirangam" },
        { value: "3466", label: "Nelliandavar Institute of Technology" },
        { value: "3701", label: "K Ramakrishnan College of Technology (Autonomous)" },
        { value: "3760", label: "Sir Issac Newton College of Engineering and Technology" },
        { value: "3766", label: "Star Lion College of Engineering and Technology" },
        { value: "3782", label: "OASYS Institute of Technology" },
        { value: "3786", label: "M.A.M. School of Engineering" },
        { value: "3795", label: "SRM TRP Engineering College" },
        { value: "3801", label: "A V C College of Engineering" },
        { value: "3802", label: "Shri Angalamman College of Engineering and Technology" },
        { value: "3803", label: "Anjalai Ammal Mahalingam Engineering College" },
        { value: "3804", label: "Arasu Engineering College" },
        { value: "3805", label: "Dhanalakshmi Srinivasan Engineering College" },
        { value: "3806", label: "E G S Pillay Engineering College (Autonomous)" },
        { value: "3807", label: "J J College of Engineering and Technology" },
        { value: "3808", label: "Jayaram College of Engineering and Technology" },
        { value: "3809", label: "Kurinji College of Engineering and Technology" },
        { value: "3810", label: "M.A.M. College of Engineering" },
        { value: "3811", label: "M I E T Engineering College" },
        { value: "3812", label: "Mookambigai College of Engineering" },
        { value: "3813", label: "Oxford Engineering College" },
        { value: "3814", label: "P R Engineering College" },
        { value: "3815", label: "Pavendar Bharathidasan College of Engineering and Technology" },
        { value: "3817", label: "Roever Engineering College" },
        { value: "3819", label: "Saranathan College of Engineering" },
        { value: "3820", label: "Trichy Engineering College" },
        { value: "3821", label: "A R J College of Engineering and Technology" },
        { value: "3822", label: "Dr.Navalar Nedunchezhiyan College of Engineering" },
        { value: "3825", label: "St. Joseph's College of Engineering and Technology" },
        { value: "3826", label: "Kongunadu College of Engineering and Technology (Autonomous)" },
        { value: "3829", label: "M.A.M. College of Engineering and Technology" },
        { value: "3830", label: "K Ramakrishnan College of Engineering (Autonomous)" },
        { value: "3831", label: "Indra Ganesan College of Engineering" },
        { value: "3833", label: "Parisutham Institute of Technology and Science" },
        { value: "3841", label: "CARE College of Engineering" },
        { value: "3843", label: "M R K Institute of Technology" },
        { value: "3844", label: "Shivani Engineering College" },
        { value: "3845", label: "Imayam College of Engineering" },
        { value: "3846", label: "Mother Terasa College of Engineering and Technology" },
        { value: "3848", label: "Vandayar Engineering College" },
        { value: "3849", label: "Annai College of Engineering and Technology" },
        { value: "3850", label: "Vetri Vinayaha College of Engineering and Technology" },
        { value: "3852", label: "Sri Bharathi Engineering College for Women" },
        { value: "3854", label: "Mahath Amma Institute of Engineering and Technology (MIET)" },
        { value: "3855", label: "As-Salam College of Engineering and Technology" },
        { value: "3857", label: "Meenakshi Ramaswamy Engineering College" },
        { value: "3859", label: "Sembodai Rukmani Varatharajan Engineering College" },
        { value: "3860", label: "St. Anne's College of Engineering and Technology" },
        { value: "3905", label: "Kings College of Engineering" },
        { value: "3908", label: "Mount Zion College of Engineering and Technology" },
        { value: "3918", label: "Shanmuganathan Engineering College" },
        { value: "3920", label: "Sudharsan Engineering College" },
        { value: "3923", label: "M N S K College of Engineering" },
        { value: "3926", label: "Chendhuran College of Engineering and Technology" },
        { value: "4020", label: "Anna University Regional Campus - Tirunelveli" },
        { value: "4023", label: "University College of Engineering Nagercoil" },
        { value: "4024", label: "University V.O.C. College of Engineering" },
        { value: "4669", label: "Thamirabharani Engineering College" },
        { value: "4670", label: "Rohini College of Engineering & Technology" },
        { value: "4672", label: "Stella Mary's College of Engineering" },
        { value: "4675", label: "Universal College of Engineering and Technology" },
        { value: "4676", label: "Renganayagi Varatharaj College of Engineering" },
        { value: "4677", label: "Lourdes Mount College of Engineering and Technology" },
        { value: "4678", label: "Ramco Institute of Technology" },
        { value: "4680", label: "AAA College of Engineering and Technology" },
        { value: "4686", label: "Good Shepherd College of Engineering and Technology" },
        { value: "4864", label: "V V College of Engineering" },
        { value: "4917", label: "Sethu Institute of Technology (Autonomous)" },
        { value: "4925", label: "Sun College of Engineering and Technology" },
        { value: "4927", label: "Maria College of Engineering and Technology" },
        { value: "4928", label: "MAR Ephraem College of Engineering & Technology" },
        { value: "4929", label: "M E T Engineering College" },
        { value: "4931", label: "Grace College of Engineering" },
        { value: "4933", label: "St. Mother Theresa Engineering College" },
        { value: "4934", label: "Holy Cross Engineering College" },
        { value: "4937", label: "A.R College of Engineering and Technology" },
        { value: "4938", label: "Sivaji College of Engineering and Technology" },
        { value: "4941", label: "Unnamalai Institute of Technology" },
        { value: "4943", label: "Satyam College of Engineering and Technology" },
        { value: "4944", label: "Arunachala College of Engineering for Women" },
        { value: "4946", label: "D M I Engineering College" },
        { value: "4949", label: "PSN Institute of Technology and Science" },
        { value: "4952", label: "C S I Institute of Technology" },
        { value: "4953", label: "CAPE Institute of Technology" },
        { value: "4954", label: "Dr. Sivanthi Aditanar College of Engineering" },
        { value: "4955", label: "Francis Xavier Engineering College (Autonomous)" },
        { value: "4956", label: "Jayamatha Engineering College" },
        { value: "4957", label: "Jayaraj Annapackiam CSI College of Engineering" },
        { value: "4959", label: "Kamaraj College of Engineering and Technology (Autonomous)" },
        { value: "4960", label: "Mepco Schlenk Engineering College (Autonomous)" },
        { value: "4961", label: "Nellai College of Engineering" },
        { value: "4962", label: "National Engineering College (Autonomous) Kovilpatti" },
        { value: "4964", label: "PSN College of Engineering and Technology (Autonomous)" },
        { value: "4965", label: "P S R Engineering College (Autonomous)" },
        { value: "4966", label: "PET Engineering College" },
        { value: "4967", label: "S Veerasamy Chettiar College of Engineering and Technology" },
        { value: "4968", label: "Sardar Raja College of Engineering" },
        { value: "4969", label: "SCAD College of Engineering and Technology" },
        { value: "4970", label: "Sree Sowdambika College of Engineering" },
        { value: "4971", label: "St. Xavier's Catholic College of Engineering" },
        { value: "4972", label: "AMRITA College of Engineering and Technology" },
        { value: "4974", label: "Government College of Engineering Tirunelveli" },
        { value: "4975", label: "Dr. G U Pope College of Engineering" },
        { value: "4976", label: "Infant Jesus College of Engineering" },
        { value: "4977", label: "Narayanaguru College of Engineering" },
        { value: "4978", label: "Udaya School of Engineering" },
        { value: "4979", label: "Arul Tharum VPMM College of Engineering and Technology" },
        { value: "4980", label: "Einstein College of Engineering" },
        { value: "4981", label: "Ponjesly College of Engineering" },
        { value: "4982", label: "Vins Christian College of Engineering" },
        { value: "4983", label: "Lord Jegannath College of Engineering and Technology" },
        { value: "4984", label: "Marthandam College of Engineering & Technology" },
        { value: "4986", label: "Noorul Islam College of Engineering and Technology" },
        { value: "4989", label: "PSN Engineering College" },
        { value: "4992", label: "Bethlahem Institute of Engineering" },
        { value: "4993", label: "Loyola Institute of Technology and Science" },
        { value: "4994", label: "J P College of Engineering College" },
        { value: "4995", label: "P.S.R.R College of Engineering" },
        { value: "4996", label: "Sri Vidya College of Engineering and Technology" },
        { value: "4998", label: "Mahakavi Bharathiyar College of Engineering and Technology" },
        { value: "4999", label: "Annai Vailankanni College of Engineering" },
        { value: "5008", label: "Thiagarajar College of Engineering" },
        { value: "5009", label: "Government College of Engineering" },
        { value: "5010", label: "Anna University Regional Campus" },
        { value: "5012", label: "Central Electrochemical Research Institute" },
        { value: "5017", label: "University College of Engineering Ramanathapuram" },
        { value: "5022", label: "University College of Engineering Dindigul" },
        { value: "5502", label: "Sri Raajaraajan College of Engineering & Technology" },
        { value: "5530", label: "SSM Institute of Engineering and Technology" },
        { value: "5532", label: "Vaigai College of Engineering" },
        { value: "5533", label: "Karaikudi Institute of Technology" },
        { value: "5536", label: "Mangayarkarasi College of Engineering" },
        { value: "5537", label: "Jainee College of Engineering and Technology" },
        { value: "5703", label: "Christian College of Engineering and Technology" },
        { value: "5832", label: "N P R College of Engineering and Technology (Autonomous)" },
        { value: "5842", label: "SRM Madurai College for Engineering and Technology" },
        { value: "5851", label: "Veerammal Engineering College" },
        { value: "5862", label: "R V S Educational Trust's Groups of Institutions" },
        { value: "5865", label: "Nadar Saraswathi College of Engineering and Technology" },
        { value: "5901", label: "Alagappa Chettiar Government College of Engineering and Technology (Autonomous)" },
        { value: "5902", label: "Bharath Niketan Engineering College" },
        { value: "5904", label: "K L N College of Engineering (Autonomous)" },
        { value: "5907", label: "Mohamed Sathak Engineering College" },
        { value: "5910", label: "P S N A College of Engineering and Technology (Autonomous)" },
        { value: "5911", label: "P T R College of Engineering and Technology" },
        { value: "5912", label: "Pandian Saraswathi Yadav Engineering College" },
        { value: "5913", label: "R V S College of Engineering" },
        { value: "5914", label: "Solamalai College of Engineering" },
        { value: "5915", label: "SACS-M A V M M Engineering College" },
        { value: "5919", label: "St. Michael College of Engineering and Technology" },
        { value: "5921", label: "Syed Ammal Engineering College" },
        { value: "5924", label: "Ganapathy Chettiar College of Engineering and Technology" },
        { value: "5930", label: "SBM College of Engineering and Technology" },
        { value: "5935", label: "Fatima Michael College of Engineering and Technology" },
        { value: "5942", label: "Ultra College of Engineering and Technology" },
        { value: "5986", label: "Velammal College of Engineering and Technology (Autonomous)" },
        { value: "5988", label: "Theni Kammavar Sangam College of Technology" },
        { value: "5990", label: "Latha Mathavan Engineering College" },
        { value: "10000", label: "Other" }
    ];

    // Filter colleges based on search (matches both value and label)
    const filteredColleges = collegeOptions.filter(opt =>
        opt.label.toLowerCase().includes(collegeSearch.toLowerCase()) ||
        opt.value.toLowerCase().includes(collegeSearch.toLowerCase())
    );


    // Validation functions
    const validateName = (name) => {
        if (!name || name.trim().length === 0) return "Name is required";
        if (name.trim().length < 2) return "Name must be at least 2 characters";
        if (name.trim().length > 50) return "Name must be less than 50 characters";
        if (/\d/.test(name)) return "Name cannot contain numbers";
        if (/[!@#$%^&*()_+=\[\]{}|\\:";'<>?,./`~]/.test(name)) return "Name cannot contain special characters";
        if (!/^[a-zA-Z\s.]+$/.test(name.trim())) return "Name can only contain letters, spaces, and periods";
        return null;
    };

    const validatePhone = (phone) => {
        if (!phone) return "Phone number is required";
        const digits = phone.replace(/\D/g, '');
        if (digits.length !== 10) return "Phone must be exactly 10 digits";
        if (!/^[6-9]/.test(digits)) return "Phone must start with 6, 7, 8, or 9";
        if (/^(.)\1{9}$/.test(digits)) return "Invalid phone number";
        return null;
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        const nameError = validateName(formData.name);
        if (nameError) newErrors.name = nameError;

        // College validation
        if (!formData.college) {
            newErrors.college = "Please select a college";
        } else if (formData.college === "10000" && (!formData.collegeOther || formData.collegeOther.trim().length < 3)) {
            newErrors.collegeOther = "Please enter your college name (min 3 characters)";
        }

        // Degree validation
        if (!formData.degree) {
            newErrors.degree = "Please select a degree";
        } else if (formData.degree === "Other" && (!formData.degreeOther || formData.degreeOther.trim().length < 2)) {
            newErrors.degreeOther = "Please enter your degree (min 2 characters)";
        }

        // Department validation
        if (!formData.department) {
            newErrors.department = "Please select a department";
        } else if (formData.department === "Other" && (!formData.departmentOther || formData.departmentOther.trim().length < 3)) {
            newErrors.departmentOther = "Please enter your department (min 3 characters)";
        }

        // Phone validation
        const phoneError = validatePhone(formData.phone);
        if (phoneError) newErrors.phone = phoneError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Detect if user is on mobile device
    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            (window.innerWidth <= 768);
    };

    // Handle redirect result on page load (for mobile sign-in)
    useEffect(() => {
        const handleRedirectResult = async () => {
            try {
                // Set loading while we check for redirect result
                setLoading(true);
                const result = await getRedirectResult(auth);
                if (result?.user) {
                    console.log('Redirect sign-in successful:', result.user.email);
                    toast.success('Signed in successfully!');
                }
            } catch (error) {
                console.error('Redirect result error:', error);
                // Don't show error for user-cancelled redirects
                if (error.code !== 'auth/popup-closed-by-user' &&
                    error.code !== 'auth/cancelled-popup-request') {
                    toast.error('Sign-in failed. Please try again.');
                }
            }
            // Note: Don't set loading to false here - onAuthStateChanged will handle it
        };
        handleRedirectResult();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const docRef = doc(db, 'registrations', currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setFormData({
                            name: data.displayName || currentUser.displayName || '',
                            college: data.college || '',
                            collegeOther: data.collegeOther || '',
                            degree: data.degree || '',
                            degreeOther: data.degreeOther || '',
                            department: data.department || '',
                            departmentOther: data.departmentOther || '',
                            year: data.year || '1',
                            phone: data.phone || ''
                        });
                        if (data.events && Array.isArray(data.events)) {
                            setRegisteredEventsList(data.events);
                        }

                        // Check if critical fields are present to consider profile "complete"
                        // Or check for a specific flag if we decide to use one.
                        // Using field presence for robustness.
                        if (data.profileCompleted || (data.college && data.phone)) {
                            setIsProfileComplete(true);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleGoogleSignIn = async () => {
        try {
            setAuthLoading(true);
            // Use redirect for mobile, popup for desktop
            if (isMobile()) {
                await signInWithRedirect(auth, googleProvider);
            } else {
                await signInWithPopup(auth, googleProvider);
                toast.success('Signed in successfully!');
            }
        } catch (error) {
            // Suppress user-initiated cancellation errors (not actual errors)
            const ignoredErrors = [
                'auth/popup-closed-by-user',
                'auth/cancelled-popup-request',
                'auth/user-cancelled'
            ];

            if (ignoredErrors.includes(error.code)) {
                // User closed popup or cancelled - this is expected behavior, not an error
                console.log("Sign-in cancelled by user");
                setAuthLoading(false);
                return;
            }

            console.error("Error signing in with Google", error);

            // Show user-friendly error messages for actual errors
            if (error.code === 'auth/popup-blocked') {
                // Fallback to redirect if popup is blocked
                console.log('Popup blocked, trying redirect...');
                await signInWithRedirect(auth, googleProvider);
            } else if (error.code === 'auth/network-request-failed') {
                toast.error('Network error. Please check your connection.');
            } else {
                toast.error(`Sign-In Failed: ${error.message}`);
            }
        } finally {
            setAuthLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setAuthLoading(true);
        try {
            if (isLoginMode) {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success("Welcome back!");
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                toast.success("Account created! Please complete your profile.");
            }
        } catch (error) {
            console.error("Auth Error:", error);
            let msg = `Authentication failed: ${error.message}`;

            // Map Firebase error codes to user-friendly messages
            if (error.code === 'auth/email-already-in-use') msg = "Email already in use. Please sign in.";
            if (error.code === 'auth/wrong-password') msg = "Invalid password."; // Legacy
            if (error.code === 'auth/user-not-found') msg = "No account found."; // Legacy
            if (error.code === 'auth/invalid-credential') msg = "Incorrect email or password."; // New standard
            if (error.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
            if (error.code === 'auth/invalid-email') msg = "Please enter a valid email address.";

            toast.error(msg);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut(auth);
        localStorage.clear();
        setFormData({
            name: '',
            college: '',
            collegeOther: '',
            degree: '',
            degreeOther: '',
            department: '',
            departmentOther: '',
            year: '1',
            phone: ''
        });
        setErrors({});
        setRegisteredEventsList([]);
        setIsProfileComplete(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error for this field
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const downloadQR = async () => {
        if (!ticketRef.current) return;
        try {
            const dataUrl = await htmlToImage.toPng(ticketRef.current);
            const link = document.createElement('a');
            link.download = `zorphix-pass-${user.uid.slice(0, 6)}.png`;
            link.href = dataUrl;
            link.click();
            toast.success('QR Code Downloaded!');
        } catch (error) {
            console.error('QR Download failed', error);
        }
    };

    const sendWelcomeEmail = async (profileData) => {
        try {
            const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');
            await fetch(`${backendUrl}/api/send-welcome-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userDetails: {
                        uid: user.uid,
                        name: profileData.name,
                        email: user.email,
                        phone: profileData.phone,
                        college: profileData.college,
                        department: profileData.department,
                        year: profileData.year,
                        events: registeredEventsList
                    }
                })
            });
        } catch (error) {
            console.error('Failed to send email', error);
        }
    };

    const [odLoading, setOdLoading] = useState(false);

    const downloadODLetter = async () => {
        if (!user || !formData.college) {
            toast.error('Please complete your profile first');
            return;
        }

        setOdLoading(true);
        const toastId = toast.loading('Generating OD Letter...');

        try {
            const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');

            // Get resolved college name
            let finalCollege = formData.college;
            if (formData.college === '10000') {
                finalCollege = formData.collegeOther?.trim() || 'College';
            } else {
                const selectedOption = collegeOptions.find(opt => opt.value === formData.college);
                if (selectedOption) finalCollege = selectedOption.label;
            }

            const response = await fetch(`${backendUrl}/api/download-od-letter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userDetails: {
                        uid: user.uid,
                        name: formData.name || user.displayName,
                        email: user.email,
                        phone: formData.phone,
                        college: finalCollege,
                        department: formData.department === 'Other' ? formData.departmentOther : formData.department,
                        year: formData.year,
                        events: registeredEventsList
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate PDF');
            }

            // Get the PDF blob
            const blob = await response.blob();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `OD_Letter_${(formData.name || user.displayName || 'Student').replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('OD Letter downloaded!', { id: toastId });
        } catch (error) {
            console.error('Failed to download OD letter', error);
            toast.error('Failed to download OD letter', { id: toastId });
        } finally {
            setOdLoading(false);
        }
    };

    const handleSubmitProfile = async (e) => {
        e.preventDefault();
        if (!user) return;

        // Validate form
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        try {
            // Update Auth Profile if name is provided
            const cleanName = formData.name.trim();
            if (cleanName && user.displayName !== cleanName) {
                await updateProfile(user, { displayName: cleanName });
            }

            // Resolve final values (use Other manual input if selected)
            // Resolve final values (use Other manual input if selected, otherwise lookup label)
            let finalCollege = formData.college;
            if (formData.college === '10000') {
                finalCollege = formData.collegeOther.trim();
            } else {
                const selectedOption = collegeOptions.find(opt => opt.value === formData.college);
                if (selectedOption) finalCollege = selectedOption.label;
            }
            const finalDegree = formData.degree === 'Other' ? formData.degreeOther.trim() : formData.degree;
            const finalDepartment = formData.department === 'Other' ? formData.departmentOther.trim() : formData.department;
            const finalPhone = formData.phone.replace(/\D/g, '').slice(-10);

            const userRef = doc(db, 'registrations', user.uid);

            // Check if profile was already completed BEFORE saving (this is the reliable check)
            const existingDocSnap = await getDoc(userRef);
            const wasAlreadyComplete = existingDocSnap.exists() && existingDocSnap.data().profileCompleted === true;

            const profileData = {
                uid: user.uid,
                displayName: cleanName || user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                name: cleanName,
                college: finalCollege,
                degree: finalDegree,
                department: finalDepartment,
                year: formData.year,
                phone: finalPhone,
                profileCompleted: true,
                updatedAt: serverTimestamp()
            };

            await setDoc(userRef, profileData, { merge: true });

            // Only send welcome email on initial profile completion (not on updates)
            if (!wasAlreadyComplete) {
                toast.success('Profile Completed Successfully!');
                sendWelcomeEmail(profileData);
            } else {
                toast.success('Profile Updated Successfully!');
            }

            setIsProfileComplete(true);

            // Auto-download QR in both cases after a short delay to ensure render
            setTimeout(() => {
                downloadQR();
            }, 1000);

        } catch (error) {
            console.error("Error saving profile:", error);
            toast.error('Failed to save profile. Please try again.');
        }
    };

    const handleDownloadTicket = async () => {
        if (!ticketRef.current) return;
        try {
            // Hide action buttons temporarily
            const actionsEl = ticketRef.current.querySelector('.ticket-actions');
            if (actionsEl) actionsEl.style.display = 'none';

            const dataUrl = await htmlToImage.toPng(ticketRef.current, {
                quality: 1,
                pixelRatio: 2,
                backgroundColor: '#111111'
            });

            // Restore actions
            if (actionsEl) actionsEl.style.display = '';

            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `Zorphix26_Ticket_${user?.uid || 'user'}.png`;
            link.click();
            toast.success("Ticket downloaded successfully!");
        } catch (err) {
            console.error("Failed to save ticket:", err);
            toast.error("Could not save ticket image.");
        }
    };

    const calculateTotalPaid = () => {
        return registeredEventsList.reduce((sum, eventName) => {
            const event = allEvents.find(e => e.name === eventName);
            return sum + (event?.price === 'FREE' ? 0 : parseInt(event?.price?.replace('₹', '') || 0));
        }, 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-[#e33e33] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#e33e33] tracking-[0.3em] animate-pulse font-bold text-xl">AUTHENTICATING SYSTEM</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-[#e33e33] selection:text-black pt-20 relative">

            {/* Backgrounds */}
            <CurrencyBackground />
            <CoinBackground />

            {/* Vignette Overlay */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)] z-0 pointer-events-none"></div>

            <div className="relative z-10 container mx-auto px-2 py-8 flex flex-col items-center justify-center min-h-[85vh]">
                <AnimatePresence mode='wait'>
                    {!user ? (
                        /* ================== UNAUTHENTICATED VIEW ================== */
                        <motion.div
                            key="login"
                            initial={{ scale: 0.9, opacity: 0, rotateX: 20 }}
                            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                            exit={{ scale: 0.9, opacity: 0, rotateX: -20 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className="w-full max-w-2xl perspective-1000"
                        >
                            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-12 text-center relative shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden group max-w-lg mx-auto">
                                {/* Decor - Massive Glow */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-[#e33e33]/5 via-transparent to-[#97b85d]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full blur-3xl pointer-events-none"></div>

                                <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight uppercase">
                                    {isLoginMode ? 'Welcome Back' : 'Join the Grid'}
                                </h1>
                                <p className="text-gray-500 font-mono tracking-widest uppercase mb-8 text-xs">
                                    /// {isLoginMode ? 'Access Credentials Required' : 'New Identity Formation'} ///
                                </p>

                                <form onSubmit={handleEmailAuth} className="space-y-4 mb-8 text-left">
                                    <div>
                                        <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:outline-none focus:border-[#e33e33] transition-colors mt-1"
                                            placeholder="enter@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest pl-1">Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:outline-none focus:border-[#e33e33] transition-colors mt-1"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={authLoading}
                                        className="w-full py-4 bg-[#e33e33] hover:bg-[#c62828] text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_10px_30px_rgba(227,62,51,0.2)] hover:shadow-[0_20px_40px_rgba(227,62,51,0.4)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                    >
                                        {authLoading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Create Account')}
                                    </button>
                                </form>

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-px bg-white/10 flex-1"></div>
                                    <span className="text-gray-600 text-xs font-mono uppercase">Or Continue With</span>
                                    <div className="h-px bg-white/10 flex-1"></div>
                                </div>

                                <button
                                    onClick={handleGoogleSignIn}
                                    disabled={authLoading}
                                    className="relative w-full py-4 bg-white hover:bg-gray-100 text-black font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 group overflow-hidden disabled:opacity-50"
                                >
                                    <FaGoogle className="text-lg" />
                                    <span>Google Access</span>
                                </button>

                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <p className="text-gray-400 text-xs">
                                        {isLoginMode ? "Don't have an account?" : "Already have an account?"}{" "}
                                        <button
                                            onClick={() => setIsLoginMode(!isLoginMode)}
                                            className="text-[#e33e33] font-bold hover:underline uppercase tracking-wide ml-1"
                                        >
                                            {isLoginMode ? "Sign Up" : "Sign In"}
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* ================== AUTHENTICATED VIEW ================== */
                        <motion.div
                            key="profile"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full max-w-5xl"
                        >
                            <div className="relative bg-[#0d0d0d] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] backdrop-blur-sm">

                                {/* Header Bar with flowing gradient */}
                                <div className="h-48 bg-gradient-to-r from-[#1a1a1a] via-[#0d0d0d] to-[#1a1a1a] relative overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d0d0d]"></div>

                                    {/* Abstract currency details in header */}
                                    <div className="absolute inset-0 flex items-center justify-between px-10 opacity-10 pointer-events-none">
                                        <FaCoins className="text-9xl text-white transform -rotate-12" />
                                        <FaWallet className="text-9xl text-white transform rotate-12" />
                                    </div>

                                    <div className="absolute top-8 right-8 z-20">
                                        <button
                                            onClick={handleSignOut}
                                            className="group flex items-center gap-3 px-6 py-3 bg-black/40 hover:bg-[#e33e33] text-gray-400 hover:text-white rounded-2xl text-xs font-bold font-mono uppercase tracking-widest border border-white/5 hover:border-[#e33e33] transition-all backdrop-blur-md"
                                        >
                                            <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" /> Sign Out
                                        </button>
                                    </div>
                                </div>

                                <div className="px-2 md:px-16 pb-16 relative z-10">
                                    {/* Avatar & User Info - Compact Version */}
                                    <div className="flex flex-col md:flex-row items-end md:items-center gap-6 -mt-16 mb-8">
                                        <div className="relative group perspective-1000">
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#e33e33] to-[#97b85d] rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                                            <motion.img
                                                whileHover={{ rotateY: 10, rotateX: -10 }}
                                                src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=e33e33&color=fff`}
                                                alt="Profile"
                                                className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl border-4 border-[#0d0d0d] shadow-2xl object-cover bg-[#1c1c1c] z-10"
                                            />
                                            {isProfileComplete && (
                                                <div className="absolute -bottom-2 -right-2 bg-[#97b85d] text-black w-8 h-8 rounded-lg flex items-center justify-center border-2 border-[#0d0d0d] shadow-xl z-20" title="Profile Verified">
                                                    <FaCheckCircle className="text-sm" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 mb-4">
                                            <div className="flex items-center gap-4 mb-4">
                                                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">{user.displayName}</h2>
                                                <button
                                                    onClick={() => setIsProfileComplete(false)}
                                                    className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 border border-transparent hover:border-white/10"
                                                    title="Edit Profile"
                                                >
                                                    <FaPen className="text-lg" />
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-xs font-bold font-mono text-gray-400">
                                                <span className={`px-4 py-2 rounded-xl border flex items-center gap-3 ${isProfileComplete ? 'bg-[#97b85d]/10 border-[#97b85d]/30 text-[#97b85d]' : 'bg-[#e33e33]/10 border-[#e33e33]/30 text-[#e33e33]'}`}>
                                                    <div className="w-2 h-2 rounded-full bg-[#97b85d] animate-pulse"></div>
                                                    {isProfileComplete ? 'ACCOUNT VERIFIED' : 'ACTION REQUIRED'}
                                                </span>
                                                <span className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 flex items-center gap-3">
                                                    UID: {user.uid.slice(0, 8).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {!isProfileComplete ? (
                                        /* ================== INCOMPLETE FORM ================== */
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="relative w-full max-w-4xl mx-auto"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#e33e33]/10 via-transparent to-[#97b85d]/10 pointer-events-none filter blur-3xl"></div>

                                            <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-[2rem] px-8 py-8 shadow-2xl">
                                                {/* Decorative Corner Accents (Smaller) */}
                                                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-[#e33e33]/30 rounded-tl-[2rem] pointer-events-none"></div>
                                                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-[#97b85d]/30 rounded-br-[2rem] pointer-events-none"></div>

                                                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-6">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-16 h-16 bg-[#e33e33]/10 rounded-xl flex items-center justify-center border border-[#e33e33]/20">
                                                            <FaUserTie className="text-2xl text-[#e33e33]" />
                                                        </div>
                                                    </div>
                                                    <div className="text-center md:text-left flex-1">
                                                        <h3 className="text-3xl font-black text-white tracking-tight leading-none mb-1">Finalize Identity</h3>
                                                        <p className="text-gray-400 text-sm leading-snug max-w-xl">
                                                            Mandatory profile registration for Zorphix Event Grid access.
                                                        </p>
                                                    </div>
                                                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#e33e33] font-mono text-[10px] font-bold tracking-widest uppercase">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#e33e33] animate-pulse"></span>
                                                        Required
                                                    </div>
                                                </div>

                                                <form onSubmit={handleSubmitProfile} className="space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                                                        {/* Name Input */}
                                                        <div className="space-y-1 group md:col-span-2">
                                                            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-focus-within:text-[#e33e33] transition-colors">Full Name *</label>
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    value={formData.name}
                                                                    onChange={handleChange}
                                                                    className={`w-full bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-lg py-2 pl-3 pr-8 text-sm font-bold text-white placeholder-white/20 focus:outline-none focus:border-[#e33e33] focus:bg-white/10 transition-all`}
                                                                    placeholder="Enter your full name (letters only)..."
                                                                />
                                                                <FaUserTie className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-sm group-focus-within:text-[#e33e33] transition-colors" />
                                                            </div>
                                                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                                                        </div>

                                                        {/* Email Input (Read Only) */}
                                                        <div className="space-y-1 group md:col-span-2">
                                                            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-focus-within:text-[#e33e33] transition-colors">Email Address (Locked)</label>
                                                            <div className="relative">
                                                                <input
                                                                    type="email"
                                                                    value={user?.email || ''}
                                                                    readOnly
                                                                    disabled
                                                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-3 pr-8 text-sm font-bold text-gray-400 cursor-not-allowed"
                                                                />
                                                                <FaGoogle className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
                                                            </div>
                                                        </div>

                                                        {/* College Dropdown - Searchable */}
                                                        <div className="space-y-1 group">
                                                            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-focus-within:text-[#e33e33] transition-colors">Institute Name * (Type to search)</label>
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Search college by name or code..."
                                                                    value={collegeSearch}
                                                                    onChange={(e) => {
                                                                        setCollegeSearch(e.target.value);
                                                                        setShowCollegeDropdown(true);
                                                                    }}
                                                                    onFocus={() => setShowCollegeDropdown(true)}
                                                                    className={`w-full bg-white/5 border ${errors.college ? 'border-red-500' : 'border-white/10'} rounded-lg py-2 pl-3 pr-8 text-sm font-bold text-white placeholder-white/30 focus:outline-none focus:border-[#e33e33] focus:bg-white/10 transition-all`}
                                                                />
                                                                <FaUniversity className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-sm pointer-events-none" />

                                                                {showCollegeDropdown && (
                                                                    <div className="absolute z-50 w-full mt-1 bg-[#111] border border-white/20 rounded-lg max-h-60 overflow-y-auto shadow-xl">
                                                                        {filteredColleges.length > 0 ? (
                                                                            filteredColleges.slice(0, 50).map(opt => (
                                                                                <div
                                                                                    key={opt.value}
                                                                                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-[#e33e33]/20 transition-colors ${formData.college === opt.value ? 'bg-[#e33e33]/30 text-white' : 'text-gray-300'}`}
                                                                                    onClick={() => {
                                                                                        setFormData({ ...formData, college: opt.value });
                                                                                        setCollegeSearch(opt.label);
                                                                                        setShowCollegeDropdown(false);
                                                                                        if (errors.college) setErrors({ ...errors, college: null });
                                                                                    }}
                                                                                >
                                                                                    <span className="text-[#e33e33] font-mono text-xs mr-2">[{opt.value}]</span>
                                                                                    {opt.label}
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            <div className="px-3 py-2 text-sm text-gray-500">No colleges found</div>
                                                                        )}
                                                                        {filteredColleges.length > 50 && (
                                                                            <div className="px-3 py-2 text-xs text-gray-500 border-t border-white/10">
                                                                                Showing 50 of {filteredColleges.length} results...
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {formData.college && (
                                                                <p className="text-[#97b85d] text-xs mt-1">
                                                                    Selected: {collegeOptions.find(c => c.value === formData.college)?.label || formData.college}
                                                                </p>
                                                            )}
                                                            {errors.college && <p className="text-red-400 text-xs mt-1">{errors.college}</p>}
                                                            {formData.college === '10000' && (
                                                                <input
                                                                    type="text"
                                                                    name="collegeOther"
                                                                    value={formData.collegeOther}
                                                                    onChange={handleChange}
                                                                    className={`mt-2 w-full bg-white/5 border ${errors.collegeOther ? 'border-red-500' : 'border-white/10'} rounded-lg py-2 pl-3 pr-8 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#e33e33]`}
                                                                    placeholder="Enter your college name..."
                                                                />
                                                            )}
                                                            {errors.collegeOther && <p className="text-red-400 text-xs mt-1">{errors.collegeOther}</p>}
                                                        </div>

                                                        {/* Degree Dropdown */}
                                                        <div className="space-y-1 group">
                                                            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-focus-within:text-[#e33e33] transition-colors">Degree *</label>
                                                            <div className="relative">
                                                                <select
                                                                    name="degree"
                                                                    value={formData.degree}
                                                                    onChange={handleChange}
                                                                    className={`w-full bg-white/5 border ${errors.degree ? 'border-red-500' : 'border-white/10'} rounded-lg py-2 pl-3 pr-8 text-sm font-bold text-white focus:outline-none focus:border-[#e33e33] focus:bg-white/10 transition-all appearance-none cursor-pointer`}
                                                                >
                                                                    <option value="" className="bg-[#111]">Select Degree...</option>
                                                                    {degreeOptions.map(opt => (
                                                                        <option key={opt.value} value={opt.value} className="bg-[#111]">{opt.label}</option>
                                                                    ))}
                                                                </select>
                                                                <FaBuilding className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-sm pointer-events-none" />
                                                            </div>
                                                            {errors.degree && <p className="text-red-400 text-xs mt-1">{errors.degree}</p>}
                                                            {formData.degree === 'Other' && (
                                                                <input
                                                                    type="text"
                                                                    name="degreeOther"
                                                                    value={formData.degreeOther}
                                                                    onChange={handleChange}
                                                                    className={`mt-2 w-full bg-white/5 border ${errors.degreeOther ? 'border-red-500' : 'border-white/10'} rounded-lg py-2 pl-3 pr-8 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#e33e33]`}
                                                                    placeholder="Enter your degree..."
                                                                />
                                                            )}
                                                            {errors.degreeOther && <p className="text-red-400 text-xs mt-1">{errors.degreeOther}</p>}
                                                        </div>

                                                        {/* Department Dropdown */}
                                                        <div className="space-y-1 group">
                                                            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-focus-within:text-[#e33e33] transition-colors">Department *</label>
                                                            <div className="relative">
                                                                <select
                                                                    name="department"
                                                                    value={formData.department}
                                                                    onChange={handleChange}
                                                                    className={`w-full bg-white/5 border ${errors.department ? 'border-red-500' : 'border-white/10'} rounded-lg py-2 pl-3 pr-8 text-sm font-bold text-white focus:outline-none focus:border-[#e33e33] focus:bg-white/10 transition-all appearance-none cursor-pointer`}
                                                                >
                                                                    <option value="" className="bg-[#111]">Select Department...</option>
                                                                    {departmentOptions.map(opt => (
                                                                        <option key={opt.value} value={opt.value} className="bg-[#111]">{opt.label}</option>
                                                                    ))}
                                                                </select>
                                                                <FaBriefcase className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-sm pointer-events-none" />
                                                            </div>
                                                            {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department}</p>}
                                                            {formData.department === 'Other' && (
                                                                <input
                                                                    type="text"
                                                                    name="departmentOther"
                                                                    value={formData.departmentOther}
                                                                    onChange={handleChange}
                                                                    className={`mt-2 w-full bg-white/5 border ${errors.departmentOther ? 'border-red-500' : 'border-white/10'} rounded-lg py-2 pl-3 pr-8 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#e33e33]`}
                                                                    placeholder="Enter your department..."
                                                                />
                                                            )}
                                                            {errors.departmentOther && <p className="text-red-400 text-xs mt-1">{errors.departmentOther}</p>}
                                                        </div>

                                                        {/* Year Dropdown */}
                                                        <div className="space-y-1 group">
                                                            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-focus-within:text-[#e33e33] transition-colors">Current Year *</label>
                                                            <div className="relative">
                                                                <select
                                                                    name="year"
                                                                    value={formData.year}
                                                                    onChange={handleChange}
                                                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-3 pr-8 text-sm font-bold text-white focus:outline-none focus:border-[#e33e33] focus:bg-white/10 transition-all appearance-none cursor-pointer"
                                                                >
                                                                    {yearOptions.map(opt => (
                                                                        <option key={opt.value} value={opt.value} className="bg-[#111]">{opt.label}</option>
                                                                    ))}
                                                                </select>
                                                                <FaChartLine className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-sm pointer-events-none" />
                                                            </div>
                                                        </div>

                                                        {/* Phone Input */}
                                                        <div className="space-y-1 group">
                                                            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-focus-within:text-[#e33e33] transition-colors">Contact Number (10 digits) *</label>
                                                            <div className="relative">
                                                                <input
                                                                    type="tel"
                                                                    name="phone"
                                                                    value={formData.phone}
                                                                    onChange={(e) => {
                                                                        // Only allow digits
                                                                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                                        setFormData({ ...formData, phone: value });
                                                                        if (errors.phone) setErrors({ ...errors, phone: null });
                                                                    }}
                                                                    maxLength={10}
                                                                    className={`w-full bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-lg py-2 pl-3 pr-8 text-sm font-bold text-white placeholder-white/20 focus:outline-none focus:border-[#e33e33] focus:bg-white/10 transition-all`}
                                                                    placeholder="9876543210"
                                                                />
                                                                <FaPhone className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-sm group-focus-within:text-[#e33e33] transition-colors" />
                                                            </div>
                                                            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                                                            <p className="text-gray-500 text-[10px]">Indian mobile number starting with 6, 7, 8, or 9</p>
                                                        </div>
                                                    </div>

                                                    <div className="pt-4 flex flex-col items-center">
                                                        <button
                                                            type="submit"
                                                            className="w-full md:w-auto px-10 py-3 bg-white text-black font-black text-sm uppercase tracking-widest rounded-xl hover:bg-[#e33e33] hover:text-white transition-all duration-300 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_-5px_rgba(227,62,51,0.6)] flex items-center justify-center gap-2"
                                                        >
                                                            Complete Profile <FaCheckCircle />
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        /* ================== COMPLETED DETAILS VIEW ================== */
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="w-full max-w-4xl mx-auto"
                                        >
                                            <>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                                    <div className="group p-4 rounded-2xl border border-white/5 bg-[#111] hover:bg-[#161616] transition-all relative overflow-hidden">
                                                        <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Institute</span>
                                                        <span className="text-sm font-bold text-white block truncate" title={formData.college}>{formData.college}</span>
                                                    </div>

                                                    <div className="group p-4 rounded-2xl border border-white/5 bg-[#111] hover:bg-[#161616] transition-all relative overflow-hidden">
                                                        <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Department</span>
                                                        <span className="text-sm font-bold text-white block truncate" title={formData.department}>{formData.department}</span>
                                                    </div>

                                                    <div className="group p-4 rounded-2xl border border-white/5 bg-[#111] hover:bg-[#161616] transition-all relative overflow-hidden">
                                                        <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Year Level</span>
                                                        <span className="text-sm font-bold text-white block">Year {formData.year}</span>
                                                    </div>

                                                    <div className="group p-4 rounded-2xl border border-white/5 bg-[#111] hover:bg-[#161616] transition-all relative overflow-hidden">
                                                        <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Contact</span>
                                                        <span className="text-sm font-bold text-white block">{formData.phone}</span>
                                                    </div>
                                                </div>


                                            </>
                                            {/* Ticket Section */
                                                (
                                                    /* ================== TICKET VIEW ================== */
                                                    <motion.div
                                                        initial={{ scale: 0.95, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        className="w-full mt-10"
                                                    >
                                                        <div className="mb-6 flex justify-between items-center">

                                                            <h3 className="text-white font-bold uppercase tracking-widest text-sm">Official Entry Pass</h3>
                                                        </div>

                                                        <div ref={ticketRef} className="flex flex-col md:flex-row bg-[#111] rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(227,62,51,0.15)] border border-[#333]">
                                                            {/* Ticket Left Side */}
                                                            <div className="flex-1 p-8 md:p-12 relative overflow-hidden">
                                                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                                                                <div className="absolute top-0 right-0 w-64 h-64 rounded-bl-full pointer-events-none" style={{ background: 'linear-gradient(to bottom right, rgba(227,62,51,0.1), transparent)' }}></div>

                                                                <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                                                                    <div>
                                                                        <div className="flex justify-between items-start mb-8">
                                                                            <div>
                                                                                <p className="text-[#e33e33] text-xs font-mono uppercase tracking-[0.3em] mb-2">Symposium Pass</p>
                                                                                <h1 className="text-3xl md:text-5xl font-serif text-white tracking-wide">ZORPHIX '26</h1>
                                                                            </div>
                                                                            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                                                                                <FaUserTie className="text-white/50" />
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-2 gap-8 mb-8">
                                                                            <div>
                                                                                <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Attendee</p>
                                                                                <p className="text-white font-mono text-lg font-bold">{user.displayName}</p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Pass ID</p>
                                                                                <p className="text-[#97b85d] font-mono text-lg font-bold">#{user.uid.slice(0, 6).toUpperCase()}</p>
                                                                            </div>
                                                                        </div>

                                                                        <div>
                                                                            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-3">Registered Events</p>
                                                                            <div className="flex flex-wrap gap-2">
                                                                                {registeredEventsList.map(event => (
                                                                                    <span key={event} className="px-3 py-1 bg-[#1a1a1a] border border-[#333] rounded text-[10px] md:text-xs text-gray-300 font-mono uppercase tracking-wider">
                                                                                        {event}
                                                                                    </span>
                                                                                ))}
                                                                                {registeredEventsList.length === 0 && <span className="text-gray-600 text-xs italic">No events registered yet.</span>}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex justify-between items-end border-t border-[#333] pt-6">
                                                                        <div>
                                                                            <p className="text-gray-600 text-[9px] uppercase tracking-widest mb-1">Date</p>
                                                                            <p className="text-gray-400 font-mono text-xs">March 15-16, 2026</p>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p className="text-gray-600 text-[9px] uppercase tracking-widest mb-1">Total Value</p>
                                                                            <p className="text-white font-mono text-xl">₹{calculateTotalPaid()}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Ticket Right Side (QR) */}
                                                            <div className="md:w-80 bg-white relative flex flex-col items-center justify-center p-8 border-l-4 border-dashed border-[#111]">
                                                                <div className="absolute top-[-10px] left-[-12px] w-6 h-6 bg-[#000] rounded-full"></div>
                                                                <div className="absolute bottom-[-10px] left-[-12px] w-6 h-6 bg-[#000] rounded-full"></div>

                                                                <div className="text-center mb-6">
                                                                    <p className="text-black font-bold uppercase tracking-[0.2em] text-xs mb-1">Scan for Entry</p>
                                                                    <p className="text-gray-400 text-[9px] uppercase tracking-widest">Admit One</p>
                                                                </div>

                                                                <div className="p-4 bg-white border-2 border-black rounded-lg mb-6 shadow-xl">
                                                                    <QRCodeSVG
                                                                        value={JSON.stringify({
                                                                            uid: user.uid,
                                                                            name: user.displayName,
                                                                            college: formData.college,
                                                                            dept: formData.department,
                                                                            year: formData.year,
                                                                            events: registeredEventsList
                                                                        })}
                                                                        size={144}
                                                                        bgColor="#ffffff"
                                                                        fgColor="#000000"
                                                                        level="H"
                                                                        className="w-32 h-32 md:w-36 md:h-36"
                                                                    />
                                                                </div>

                                                                <p className="text-[10px] text-gray-400 font-mono text-center mb-8 break-all px-4">
                                                                    {user.uid}
                                                                </p>

                                                                <div className="ticket-actions w-full space-y-2">
                                                                    <button
                                                                        onClick={handleDownloadTicket}
                                                                        className="w-full py-3 bg-[#e33e33] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#c62828] transition-colors flex items-center justify-center gap-2 rounded-lg"
                                                                    >
                                                                        <FaDownload /> Download Ticket
                                                                    </button>
                                                                    <button
                                                                        onClick={downloadODLetter}
                                                                        disabled={odLoading}
                                                                        className="w-full py-3 bg-[#97b85d] text-black font-bold uppercase tracking-widest text-xs hover:bg-[#7a9a4a] transition-colors flex items-center justify-center gap-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    >
                                                                        <FaDownload /> {odLoading ? 'Generating...' : 'Download OD Letter'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}

                                            {/* User Queries Section */}
                                            <UserQueries />
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Profile;
