// Contact form: check every field, then prepare an email

var EMAIL_TO = 'victordami222@gmail.com';

var form = document.getElementById('contact-form');
var summary = document.getElementById('form-summary');
var success = document.getElementById('form-success');
var mailLink = document.getElementById('mail-link');

var fields = {
  name: document.getElementById('c-name'),
  email: document.getElementById('c-email'),
  phone: document.getElementById('c-phone'),
  message: document.getElementById('c-message')
};

function setError(key, message) {
  var field = fields[key];
  var wrap = field.closest('.field');
  var errorEl = document.getElementById(field.id + '-error');
  errorEl.textContent = message;
  wrap.classList.toggle('has-error', message !== '');
  field.setAttribute('aria-invalid', message !== '' ? 'true' : 'false');
}

function validate() {
  var problems = 0;

  var name = fields.name.value.trim();
  var email = fields.email.value.trim();
  var phone = fields.phone.value.trim();
  var message = fields.message.value.trim();

  if (name === '') {
    setError('name', 'Please enter your name.');
    problems++;
  } else {
    setError('name', '');
  }

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email === '') {
    setError('email', 'Please enter your email address.');
    problems++;
  } else if (!emailPattern.test(email)) {
    setError('email', 'That email address does not look right. Example: name@example.com');
    problems++;
  } else {
    setError('email', '');
  }

  if (phone === '') {
    setError('phone', 'Please enter your phone number.');
    problems++;
  } else if (!/^[0-9]+$/.test(phone)) {
    setError('phone', 'Use digits only. No spaces, letters or symbols.');
    problems++;
  } else if (phone.length < 7 || phone.length > 15) {
    setError('phone', 'A phone number should have 7 to 15 digits.');
    problems++;
  } else {
    setError('phone', '');
  }

  if (message === '') {
    setError('message', 'Please write a message.');
    problems++;
  } else if (message.length < 10) {
    setError('message', 'Please write at least 10 characters.');
    problems++;
  } else {
    setError('message', '');
  }

  return problems;
}

form.addEventListener('submit', function (event) {
  event.preventDefault();
  success.classList.remove('show');

  var problems = validate();

  if (problems > 0) {
    summary.textContent = 'Please fix the ' + (problems === 1 ? 'highlighted field' : problems + ' highlighted fields') + ' and try again.';
    summary.classList.add('show');
    return;
  }

  summary.classList.remove('show');

  var subject = 'Message from ' + fields.name.value.trim() + ' (portfolio website)';
  var body = fields.message.value.trim() +
    '\n\nName: ' + fields.name.value.trim() +
    '\nEmail: ' + fields.email.value.trim() +
    '\nPhone: ' + fields.phone.value.trim();

  mailLink.href = 'mailto:' + EMAIL_TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  success.classList.add('show');
  success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// Clear an error as soon as the visitor starts fixing it
Object.keys(fields).forEach(function (key) {
  fields[key].addEventListener('input', function () {
    setError(key, '');
  });
});
