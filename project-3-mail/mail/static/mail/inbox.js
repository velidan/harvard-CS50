
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

  const mailboxInstance = mailboxFactory.getInstance(mailbox, {
    emailsViewSelector: '#emails-view', EmailModel: Email, emailViewSelector: '#email-view', httpService})
    .clear()

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
      const inbox = mailboxFactory.getInstance(mailbox)
      inbox.setEmails(res)
      .renderEmailPreviews()
    })
    .catch(handleErrors)
 
}


//// -----------------------------------------------------------

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
    if (typeof className === 'string') {
      res.className = className;
    }

    return res;
  }
  createTextNode(text) {
    const res = document.createTextNode(text);
    return res;
  }

  fillElByTextNode(el, text) {
    const textNode = this.createTextNode(text);
    this.render(el, textNode);
  }

  checkIfDomEl = el => el instanceof Element;
  // checkIfTextNode = node => node?.nodeType === Node.TEXT_NODE

  render(el, content) {
    if (!this.checkIfDomEl(el)) throw new Error(`Please, pass the valid DOM el. Received: ${el}, ${typeof el} `);

    const finalContent = content || this.noResultContent;
    
    el.appendChild(finalContent);
    return this;
  }

  getDOMElementBySelector = selector => document.querySelector(selector);

  renderMany(el, ...children) {
    if (!this.checkIfDomEl(el)) throw new Error(`Please, pass the valid DOM el. Received: ${el}, ${typeof el} `);

    el.append(...children);
    return this;
  }

  
  attachEvent(el, eventName, cb) {
    if (!this.checkIfDomEl(el)) throw new Error(`Please, pass the valid DOM el. Received: ${el}, ${typeof el} `);

    if (!eventName) throw new Error('Please, pass the event name');

    if (typeof cb !== 'function') throw new Error('Callback must be a function');

    // ignore options
    el.addEventListener(eventName, cb);
    return this;
  }

  hideEl = el => {
    el.style.display = 'none';
    return this;
  };
  showEl = el => {
    el.style.display = 'block';
    return this;
  };

  clear(el) {
    if (!this.checkIfDomEl(el)) throw new Error(`Please, pass the valid DOM el. Received: ${el}, ${typeof el} `);

    el.replaceChildren();
    return this;
  }
}

class Mailbox extends Renderer {
  // save views EL to avoid repetative operation get from DOM
  emailsViewEl;
  emailViewEl;



  mode;

  // selectors = {
  //   emailsViewSelector: null,
  //   emailViewSelector: null
  // }

  emails;

  EmailModel;

  httpService;

  activeEmail;

  get rootEl() {
    let res;

    switch(this.mode) {
      case 'emails':
        res = this.emailsViewEl;
        break;
      case 'email':
       res = this.emailViewEl;
        break;
      default:
        break;
    }


    return res;
  };


  constructor(params) {

    const { emailsViewSelector, emailViewSelector, EmailModel, httpService } = params;
  
    super()

    this.httpService = httpService;
  
    this.emailsViewEl = this.getDOMElementBySelector(emailsViewSelector);
    this.emailViewEl = this.getDOMElementBySelector(emailViewSelector);

    // by default
    this.setViewMode('emails');

    this.EmailModel = EmailModel;
  }

  setHttpService = (httpService) => {
    this.httpService = httpService;
  }

  // setRootEl(el) {
  //   this.rootEl = el;
  //   return this;
  // }

  setViewMode(mode) {
    if (this.mode === mode) return;
    
    
    this.mode = mode;
    
    if (mode === 'emails') {
      this.renderActiveModeEl(this.emailsViewEl, this.emailViewEl);
    } else {
      this.renderActiveModeEl(this.emailViewEl, this.emailsViewEl);
    }
    
  }

  renderActiveModeEl = (elToRender, elToHide) => {
    this.hideEl(elToHide);
    this.showEl(elToRender)
  }

  setEmails(emailsData, ) {
    this.emails = emailsData.map(o => new this.EmailModel(o)
      .setOnPreviewClickCb(this.onEmailPreviewClick));
    return this;
  }

  renderTitle(content) {
    if (!content) return null;


    const titleEl = super.createElement('h3', 'mailbox-title');
    const text = super.createTextNode(content);
    super.render(titleEl, text);
    super.render(this.rootEl, titleEl);

  }


  renderEmailPreviews() {
    this.setViewMode('emails');

    this.emails.forEach(emailModel => {
      const emailPreviewNode = emailModel.getPreviewNode();
      super.render(this.rootEl, emailPreviewNode);
    });
  }

  renderEmail() {
    this.setViewMode('email');
    const emailFullNode = this.activeEmail.getFullNode();

    super.render(this.rootEl, emailFullNode);
    console.log("--- RENDER EMAIL ---", this.activeEmail);
  }

  clear() {
    super.clear(this.rootEl);
    return this;
  }


  onEmailPreviewClick = (emailJson) => {
    console.log("MailboxInbox emailJson =>>>> ", emailJson)
    const {id, read} = emailJson;
    /* 
       Here I will use the http service to fetch the email detail
       but basically it's redundant as we already have all the required data 
       that comes from the emails array. Furthermore I could just pass the
       whole email model and reduce O(n) by substraction serialize/fetch/new model generation/assign
    */

    this.httpService
      .getMailboxEmail(id)
      .then(res => {
        // res === emailJson so we could use it without the request
        this.activeEmail = new this.EmailModel(res);
       this.renderEmail();
       
       if (!read) {
        this.httpService.updateEmailReadStatus(id, true)
       }
       
      })
      .catch(handleErrors)
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

  // onEmailPreviewClick = (emailJson) => {
  //   console.log("MailboxSent emailJson =>>>> ", emailJson)


  // }


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

  // onEmailPreviewClick = (emailJson) => {
  //   console.log("MailboxArchive emailJson =>>>> ", emailJson)
  // }


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

  __onPreviewClickCb;

  get fullNodeHeaderConfig() {
    return {
      sender: this.sender,
      recipients: this.recipients,
      subject: this.subject,
      timestamp: this.timestamp,
    }
  }

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

  setOnPreviewClickCb(onPreviewClickCb) {
    if (typeof onPreviewClickCb !== 'function') {
      throw new Error('Callback must be a function');
    }
    this.__onPreviewClickCb = (_clickEvent) => onPreviewClickCb(this.serialize());

    return this;
  }

  serialize() {
    return {
      id: this.id,
      sender: this.sender,
      recipients: this.recipients,
      subject: this.subject,
      body: this.body,
      timestamp: this.timestamp,
      read: this.read,
      archived: this.archived
    }
  }
  
  
  getPreviewNode() {
    const wrapperClasses = `mail-wrapper ${this.read ? ' read': ''}`;
    const wrapperEl = super.createElement('div', wrapperClasses);

  
    super.attachEvent(wrapperEl, 'click', this.__onPreviewClickCb);


    const authorEl = super.createElement('b', 'mail-author');
    super.fillElByTextNode(authorEl, this.sender);


    const subjectEl = super.createElement('p', 'mail-subject');
    super.fillElByTextNode(subjectEl, this.subject);

    const timestampEl = super.createElement('span', 'mail-timestamp');
    super.fillElByTextNode(timestampEl, this.timestamp);

    super.renderMany(wrapperEl, authorEl, subjectEl, timestampEl);
    
    return wrapperEl;
  }

  getFullNode() {
    const wrapperEl = super.createElement('section', 'mail-wrapper');
    const headerEl = this.getFullNodeHeaderEl();
    const bodyEl = this.getFullNodeBodyEl()

    super.renderMany(wrapperEl, headerEl, bodyEl);

    return wrapperEl;
  }

  getFullNodeHeaderEl() {
    const headerEl = super.createElement('div', 'mail-header');
    for (const [label, content] of Object.entries(this.fullNodeHeaderConfig)) {
      let finalContent = content;

      if (label === 'recipients') {

        // recipients is array so should handle it separatedly
        finalContent = this.getRecipientsNode(content);
      }

      const rowEl = this.getRowEl(label, finalContent);
      super.render(headerEl, rowEl)
    }

    return headerEl;
  }

  getFullNodeBodyEl() {
    const bodyEl = super.createElement('div', 'mail-body');
    super.fillElByTextNode(bodyEl, this.body);

    return bodyEl;
  }
  

  getRowEl(label, content) {

    const leftEL = super.createElement('b', 'mail-left-col');
    super.fillElByTextNode(leftEL, label);
    
    let rightEl;
    if (typeof content === 'string') {
      rightEl = super.createElement('span', 'mail-right-col');
      super.fillElByTextNode(rightEl, content);
    } else {
      // recipients is DOM node
      rightEl = content;
    }

    const rowEl = super.createElement('div', 'mail-row');
    super.renderMany(rowEl, leftEL, rightEl);

    return rowEl;
  }

  getRecipientsNode(recipients) {
    if (!recipients.length) throw new Error('Email can not be without any recipient');

    const wrapperEl = super.createElement('p', 'recipients-wrapper');

    for (const recipient of recipients) {
      const recipientEl = super.createElement('span');
      super.fillElByTextNode(recipientEl, recipient);
      super.render(wrapperEl, recipientEl)
    }

    return wrapperEl;
  }


}

// --- compose form send
function handleComposeForm(id) {
  if (!id) throw new Error('Please, pass the id of the compose form');
  
  const formEl = document.forms['compose-form'];
  const recipientsInput = formEl.querySelector('#compose-recipients')
  const subjectInput = document.getElementById('compose-subject')
  const composeBodyTextArea = formEl.getElementsByTagName('textarea')?.[0];

  
  if (!formEl) throw new Error(`Can't find in DOM the form with id: ${id}`)
 
  formEl.addEventListener('submit', e => {
    e.preventDefault();

    let recipients;
    let subject;
    let message;

    try {
      recipients = recipientsInput.value;
      subject = subjectInput.value;
      message = composeBodyTextArea.value;
    } catch (e) {
      throw new Error(e);
    }

    httpService.sendEmail(recipients, subject, message)
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


  const reponseHandler = res => {
    const error = res.error;

    if (error) {
      throw error;
    }

    return res;
  }

  function sendEmail(recipients, subject, message) {

    return httpClient(API_PATHS.emails, {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: message
      })
    })
    .then(response =>  response.json())
    .then(reponseHandler)
  }

  function getMailboxEmails(mailbox) {

    return httpClient(API_PATHS.getMailboxPath(mailbox))
    .then(response => response.json())
    .then(reponseHandler)
  }

  function getMailboxEmail(emailId) {

    return httpClient(API_PATHS.getEmailPath(emailId))
    .then(response => response.json())
    .then(reponseHandler)
  }

  function updateEmailReadStatus(emailId, read) {

    return httpClient(API_PATHS.getEmailPath(emailId), {
      method: 'PUT',
      body: JSON.stringify({
          read
      })
    })
    .then(response => response.json())
    .then(reponseHandler)
  }



  return {
    sendEmail,
    getMailboxEmails,
    getMailboxEmail,
    updateEmailReadStatus
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
