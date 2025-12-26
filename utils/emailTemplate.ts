export const getEmailTemplate = (name: string) => `
<!-- Banner Image -->
<img src="your-banner-url.jpg" alt="Zorphix Symposium Banner" class="banner-image">

<h1 class="custom-heading">Welcome to Zorphix 2025!</h1>

<p class="event-details">
    Welcome ${name},We are excited to announce that Zorphix, a national-level symposium, is being conducted by the Computer Science and Business System department at Chennai Institute of Technology, Kundrathur. This event is a great opportunity to engage, learn, and grow with like-minded individuals in the field.
</p>

<p class="event-details">
    <strong>Details of the Event:</strong><br>
    Zorphix is a national-level symposium conducted by the Computer Science and Business System department at Chennai Institute of Technology, Kundrathur. It is going to be held on 6th February 2025.
</p>

<div class="left-aligned">
    <p class="event-details">
        <strong>Date:</strong><br>
        6th February 2025
    </p>
    
    <p class="event-details">
        <strong>Venue:</strong><br>
        Chennai Institute of Technology, Kundrathur
    </p>
</div>

<p class="event-details" style="text-align: center;">
    Thank you for registering for this event! We look forward to your participation and hope you have a fruitful experience.
</p>
`;

export const getUpdatedQREmailTemplate = (name: string) => `
<!-- Banner Image -->
<img src="your-banner-url.jpg" alt="Zorphix Symposium Banner" class="banner-image">

<h1 class="custom-heading">Your Updated QR Code - Zorphix 2025</h1>

<p class="event-details">
    Hello ${name},
</p>

<p class="event-details">
    Your profile has been successfully updated! We have generated a new QR code reflecting your updated information. Please find your updated QR code attached to this email.
</p>

<p class="event-details">
    <strong>Important:</strong> Please use this new QR code for event entry. Your previous QR code is no longer valid.
</p>

<div class="left-aligned">
    <p class="event-details">
        <strong>Event Date:</strong><br>
        6th February 2025
    </p>
    
    <p class="event-details">
        <strong>Venue:</strong><br>
        Chennai Institute of Technology, Kundrathur
    </p>
</div>

<p class="event-details" style="text-align: center;">
    If you did not make these changes, please contact our support team immediately. We look forward to seeing you at Zorphix 2025!
</p>
`;
