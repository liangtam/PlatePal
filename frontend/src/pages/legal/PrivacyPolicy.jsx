import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-policy">
            <h1>PlatePal Privacy Policy</h1>
            <p>
                This Privacy Policy describes how PlatePal ("we", "us", or "our") collects,
                uses, and discloses your information when you use our mobile application
                (the "App").
            </p>
            <h2>Information We Collect</h2>
            <p>
                We collect the following information when you use the App:
            </p>
            <ul>
                <li>User Login Credentials: Username and password (hashed) for login.</li>
                <li>Ingredients: Ingredients you input to generate recipes.</li>
                <li>
                    Favorited Recipes: A list of recipes you save for future reference.
                    Recipe modifications you make.
                </li>
                <li>User-uploaded Recipe Photos.</li>
            </ul>
            <h2>How We Use Your Information</h2>
            <p>
                We use the information we collect to:
            </p>
            <ul>
                <li>Provide and improve the App's functionality.</li>
                <li>Generate recipes based on your inputted ingredients.</li>
                <li>Allow you to save and revisit your favorite recipes.</li>
                <li>Display user-uploaded recipe photos.</li>
            </ul>
            <h2>Data Storage and Security</h2>
            <p>
                We take reasonable steps to protect the information we collect from you.
                However, no internet transmission or electronic storage method is 100%
                secure. Therefore, while we strive to use commercially acceptable means to
                protect your information, we cannot guarantee its absolute security.
            </p>
            <h2>Your Choices</h2>
            <p>
                You can access and update your information in the App's settings section.
                You can also choose to delete your account at any time.
            </p>
            <h2>Changes to This Privacy Policy</h2>
            <p>
                We may update this Privacy Policy from time to time. We will notify you of
                any changes by posting the new Privacy Policy on the App.
            </p>
            <h2>Contact Us</h2>
            <p>
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                platepalservice@gmail.com
            </p>
        </div>
    );
}

export default PrivacyPolicy;
