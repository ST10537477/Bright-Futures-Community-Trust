(function () {
  "use strict";
 
  let EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let PHONE_PATTERN = /^[0-9+\-\s()]{7,20}$/;
  let RECIPIENT_EMAIL = "hello@brightfuturestrust.org";
 
  /** Show an inline error message under a field (or fieldset). */
  function showError(field, message) {
    let row = field.closest(".form-row") || field.closest("fieldset");
    if (!row) return;
    row.classList.add("has-error");
 
    let error = row.querySelector(".field-error");
    if (!error) {
      error = document.createElement("p");
      error.className = "field-error";
      row.appendChild(error);
    }
    error.textContent = message;
  }

  /** Remove a previously shown error for a field (or fieldset). */
  function clearError(field) {
    let row = field.closest(".form-row") || field.closest("fieldset");
    if (!row) return;
    row.classList.remove("has-error");
    let error = row.querySelector(".field-error");
    if (error) error.remove();
  }

  /* enquiry.html form validation */

  let PROGRAM_INFO = {
    "after-school": { name: "After-School Education", cost: "Free", availability: "4 spots open this term" },
    "mentorship": { name: "Mentorship", cost: "Free", availability: "Next mentor pairing round starts in 2 weeks" },
    "family-support": { name: "Family Support", cost: "Free", availability: "Open enrolment, no waitlist" },
    "general": { name: "our programs", cost: "Free or low-cost depending on the program", availability: "We'll confirm once we know a bit more" }
  };

  function setupEnquiryForm() {
    let form = document.getElementById("enquiryForm");
    if (!form) return;
 
    let donationSelect = document.getElementById("donationAmount");
    let customRow = document.getElementById("customAmountrow");
    let customInput = document.getElementById("customAmount");
    let responseBox = document.getElementById("enquiryResponse");
 
    // Reveal the "custom amount" field only when that option is chosen
    if (donationSelect && customRow) {
      donationSelect.addEventListener("change", function () {
        let isCustom = donationSelect.value === "custom";
        customRow.hidden = !isCustom;
        if (!isCustom) customInput.value = "";
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      let valid = true;
 
      let enquiryType = form.querySelector('input[name="enquiry-type"]:checked');
      let fieldset = form.querySelector("fieldset");
      let fullName = document.getElementById("fullName");
      let email = document.getElementById("email");
      let phone = document.getElementById("phone");
      let program = document.getElementById("program");
      let message = document.getElementById("message");
 
      [fullName, email, phone, message, fieldset].forEach(clearError);
 
      if (!enquiryType) {
        showError(fieldset, "Please select what you're enquiring about.");
        valid = false;
      }
      if (fullName.value.trim().length < 2) {
        showError(fullName, "Please enter your full name.");
        valid = false;
      }
      if (!EMAIL_PATTERN.test(email.value.trim())) {
        showError(email, "Please enter a valid email address.");
        valid = false;
      }
      if (phone.value.trim() && !PHONE_PATTERN.test(phone.value.trim())) {
        showError(phone, "Please enter a valid phone number.");
        valid = false;
      }
      if (message.value.trim().length < 10) {
        showError(message, "Please add a few more details (at least 10 characters).");
        valid = false;
      }
       if (customRow && !customRow.hidden) {
        let amount = parseFloat(customInput.value);
        if (!amount || amount <= 0) {
          showError(customInput, "Please enter an amount greater than 0.");
          valid = false;
        }
      }
 
      if (!valid) {
        responseBox.className = "form-response";
        return;
      }
 
      // Valid — "process" the enquiry and show a relevant response
      let info = PROGRAM_INFO[program.value] || PROGRAM_INFO.general;
      let firstName = fullName.value.trim().split(" ")[0];

       responseBox.innerHTML =
        "<h4>Thanks, " + firstName + "!</h4>" +
        "<p>Here's what you asked about — <strong>" + info.name + "</strong>:</p>" +
        "<p>Cost: " + info.cost + "<br>Availability: " + info.availability + "</p>" +
        "<p>We'll follow up at " + email.value.trim() + " within 3 business days.</p>";
      responseBox.className = "form-response is-visible is-success";
 
      form.reset();
      if (customRow) customRow.hidden = true;
    });
  }

  /* contact.html form validation */

  function setupContactForm() {
    let form = document.getElementById("contactForm");
    if (!form) return;
 
    let responseBox = document.getElementById("contactResponse");
 
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      let valid = true;
 
      let name = document.getElementById("cName");
      let email = document.getElementById("cEmail");
      let message = document.getElementById("cMessage");
 
      [name, email, reason, message].forEach(clearError);
 
      if (name.value.trim().length < 2) {
        showError(name, "Please enter your name.");
        valid = false;
      }
      if (!EMAIL_PATTERN.test(email.value.trim())) {
        showError(email, "Please enter a valid email address.");
        valid = false;
      }
      if (!reason.value) {
        showError(reason, "Please choose a reason for contacting us.");
        valid = false;
      }
      if (message.value.trim().length < 10) {
        showError(message, "Please add a little more detail (at least 10 characters).");
        valid = false;
      }
 
      if (!valid) return;

       // Valid — compile the message into an email and hand it to the
      // visitor's own email app so they can review and send it.
      let reasonText = reason.options[reason.selectedIndex].text;
      let subject = "Website message (" + reasonText + ") from " + name.value.trim();
      let body =
        "Name: " + name.value.trim() + "\n" +
        "Email: " + email.value.trim() + "\n" +
        "Reason: " + reasonText + "\n\n" +
        message.value.trim();
 
      let mailtoLink =
        "mailto:" + RECIPIENT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
 
      responseBox.innerHTML =
        "<h4>Thanks, " + name.value.trim() + "!</h4>" +
        "<p>Opening your email app so you can send this to us at " + RECIPIENT_EMAIL + ".</p>";
      responseBox.className = "form-response is-visible is-success";
 
      window.location.href = mailtoLink;
      form.reset();
    });
  }
 
  document.addEventListener("DOMContentLoaded", function () {
    setupEnquiryForm();
    setupContactForm();
  });
})();