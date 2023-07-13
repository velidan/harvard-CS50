

let httpService;

document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');

  // compose send
  handleComposeForm('compose-form');
});

const API_PATHS = {
  emails: '/emails',
  getMailboxPath(mailbox) {
    if (!mailbox) throw new Error('Please, pass the mailbox type you want to get');

    return `${this.emails}/${mailbox}`
  },
  getEmailPath(id) {
    if (!id) throw new Error('Please, pass the id of the mail you want to get');

    return `${this.emails}/${id}`
  }
};

const ERRORS = {
  noRecepient: "At least one recipient required.",
  userNotExists: "User with email sdfsdf does not exist."
}


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}

function handleComposeForm(id) {
  if (!id) throw new Error('Please, pass the id of the compose form');
  
  const formEl = document.forms['compose-form'];
  const recepientsInput = formEl.querySelector('#compose-recipients')
  const subjectInput = document.getElementById('compose-subject')
  const composeBodyTextArea = formEl.getElementsByTagName('textarea')?.[0];

  
  if (!formEl) throw new Error(`Can't find in DOM the form with id: ${id}`)
 
  formEl.addEventListener('submit', e => {
    e.preventDefault();

    let recepients;
    let subject;
    let message;

    try {
      recepients = recepientsInput.value;
      subject = subjectInput.value;
      message = composeBodyTextArea.value;
    } catch (e) {
      throw new Error(e);
    }

    httpService.sendEmail(recepients, subject, message)
    .then(res => {
      console.log('res -> ', res);
      load_mailbox('sent')
    })
    .catch(handleErrors)

  })
}


// ------ CORE -------- //
function handleErrors(error) {
  switch (error) {
    case ERRORS.noRecepient:
      alert('NO RECEPIENT');
      break;
    case ERRORS.userNotExists:
      alert('USER DOES NOT EXISTS');
      break;
    default:
      break;
    }
}


// http client should have post/get interfaces but let's just omit it
httpService = ((httpClient, API_PATHS) => { 

  if (!httpClient) throw new Error('Please, pass the preffered HTTP client');
  if (!API_PATHS) throw new Error('Please, pass the API paths');

  function sendEmail(recepients, subject, message) {

    return httpClient(API_PATHS.emails, {
      method: 'POST',
      body: JSON.stringify({
          recipients: recepients,
          subject: subject,
          body: message
      })
    })
    .then(response =>  response.json())
    .then(res => {
      const error = res.error;

      if (error) {
        throw error;
      }
    })
  }



  return {
    sendEmail
  }
})(fetch, API_PATHS)

// ------ !CORE -------- //
