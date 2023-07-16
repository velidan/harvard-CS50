
// INIT  -------- TODO init function would be nice
let httpService;
let mailboxFactory;

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
  userNotExists: "User with email sdfsdf does not exist.",
  invalidMailbox: "Invalid mailbox."
}

// !INIT  --------

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

  const mailboxInstance = mailboxFactory.getInstance(mailbox, {selector: '#emails-view', EmailModel: Email})
  mailboxInstance.clear()

  loadMailboxEmails(mailbox);
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  // document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  mailboxInstance.renderTitle()
}


// --- load mailbox 
function loadMailboxEmails(mailbox) {
    
  if (!mailbox) throw new Error('Please, pass the correct mailbox')

  httpService.getMailboxEmails(mailbox)
    .then(res => {
      console.log('res', res)
      const inbox = mailboxFactory.getInstance('inbox')
      inbox.setEmails(res)
      .render()
    })
    .catch(handleErrors)
 
}

class Renderer {


  get noResultContent() {
    const p = this.createElement('p', 'no-result-msg');
    const textNode = document.createTextNode('No result');
    p.appendChild(textNode);

    return p;
  };

  createElement(tag, className) {
    if (!tag) throw new Error('Tag must be passed!');

    const res = document.createElement(tag);
    res.className = className;
    return res;
  }
  createTextNode(text) {
    const res = document.createTextNode(text);
    return res;
  }

  checkIfDomEl = el => el instanceof Element;
  // checkIfTextNode = node => node?.nodeType === Node.TEXT_NODE

  render(el, content) {
    if (!this.checkIfDomEl(el)) throw new Error(`Please, pass the valid DOM el. Received: ${el}, ${typeof el} `);

    const finalContent = content || this.noResultContent;
    
    el.appendChild(finalContent);
  }

  renderMany(el, ...children) {
    if (!this.checkIfDomEl(el)) throw new Error(`Please, pass the valid DOM el. Received: ${el}, ${typeof el} `);

    el.append(...children);
  }

  clear(el) {
    if (!this.checkIfDomEl(el)) throw new Error(`Please, pass the valid DOM el. Received: ${el}, ${typeof el} `);

    el.replaceChildren();
  }
}

class Mailbox extends Renderer {
  rootEl;

  emails;

  EmailModel;

  constructor(params) {
    super();
    const { selector, EmailModel } = params;
    this.rootEl = document.querySelector(selector);
    this.EmailModel = EmailModel;
  }

  setEmails(emailsData) {
    this.emails = emailsData.map(o => new this.EmailModel(o));
    return this;
  }


  renderTitle(content) {
    if (!content) return null;


    const titleEl = super.createElement('h3', 'mailbox-title');
    const text = super.createTextNode(content);
    super.render(titleEl, text);
    super.render(this.rootEl, titleEl);

  }

  render() {

    
    console.log(' MAILBOX RENDER', this.emails)

    this.emails.forEach(emailModel => {
      const emailPreviewNode = emailModel.getPreviewNode();
      super.render(this.rootEl, emailPreviewNode);
    });

    
  }

  clear() {
    super.clear(this.rootEl);
    return this;
  }
}

class MailboxInbox extends Mailbox {

  title = "Inbox"

  constructor(params) {
   super(params); 
  }

  renderTitle() {
    super.renderTitle(this.title);
  }

  render() {
    console.log(' MAIL BOX INBOX RENDER')
    super.render();
  }
}
class MailboxSent extends Mailbox {

  title = "Sent"

  constructor(params) {
    super(params); 
  }

  renderTitle() {
    super.renderTitle(this.title);
  }

  render() {
    console.log(' MAIL BOX INBOX RENDER')
    super.render();
  }
}
class MailboxArchive extends Mailbox {

  title = "Archived"

  constructor(params) {
    super(params); 
  }

  renderTitle() {
    super.renderTitle(this.title);
  }

}

// --- !load mailbox 

class Email extends Renderer {
  id;
  sender;
  recipients;
  subject;
  body;
  timestamp;
  read;
  archived;

  constructor(data) {
    super();

    const {
      id, sender, recipients, subject, body, timestamp, read, archived
    } = data;

    this.id = id;
    this.sender = sender;
    this.recipients = recipients;
    this.subject = subject;
    this.body = body;
    this.timestamp = timestamp;
    this.read = read;
    this.archived = archived;
  }

  
  
  getPreviewNode() {
    const wrapperClasses = `mail-wrapper ${this.read ? ' read': ''}`;
    const wrapperEl = super.createElement('div', wrapperClasses);

  


    const authorEl = super.createElement('b', 'mail-author');
    const senderTextNode = super.createTextNode(this.sender);
    super.render(authorEl, senderTextNode);

    const subjectEl = super.createElement('p', 'mail-subject');
    const subjectTextNode = super.createTextNode(this.subject);
    super.render(subjectEl, subjectTextNode);

    const timestampEl = super.createElement('span', 'mail-timestamp');
    const timestampTextNode = super.createTextNode(this.timestamp);
    super.render(timestampEl, timestampTextNode);

    super.renderMany(wrapperEl, authorEl, subjectEl, timestampEl);

    // super.render(wrapperEl, authorEl);
    // super.render(wrapperEl, subjectEl);
    // super.render(wrapperEl, timestampEl);

    // super.render(this.rootEl, wrapperEl);
    
    return wrapperEl;

  



    // super.render();
  }
  
  render() {

  }
}

// --- compose form send
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
// --- !compose form send

// ------ CORE -------- //
function handleErrors(error) {
  switch (error) {
    case ERRORS.noRecepient:
      alert('NO RECEPIENT');
      break;
    case ERRORS.userNotExists:
      alert('USER DOES NOT EXISTS');
      break;
    case ERRORS.invalidMailbox:
      alert('INVALID MAILBOX');
      break;
    default:
      alert('SOME ERRRO HAPPENED: ' + error)
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

  function getMailboxEmails(mailbox) {

    return httpClient(API_PATHS.getMailboxPath(mailbox))
    .then(response => response.json())
    .then(res => {
      const error = res.error;

      if (error) {
        throw error;
      }

      return res;
    })
  }



  return {
    sendEmail,
    getMailboxEmails
  }
})(fetch, API_PATHS)


mailboxFactory = (() => {

  const registry = {
    inbox: MailboxInbox,
    sent: MailboxSent,
    archive: MailboxArchive,
  }

  const cache = {}

  return {
    getInstance: (mailbox, arguments) => {
      if (!mailbox) throw new Error('Please, pass the mailbox type')
      const instance = registry[mailbox];
      if (instance === 'undefined') throw new Error(`Supported mailbox are: ${Object.keys(registry)}`);
  
      let resultInstance = cache[mailbox];
      // empty. Should create the new instance
      if (!resultInstance) {
        resultInstance = cache[mailbox] = new registry[mailbox](arguments);
      }
  
      return resultInstance;
    }
  }


})();



// ------ !CORE -------- //
