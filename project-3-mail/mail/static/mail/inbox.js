//  ----- Initial
let httpService;
let router;
let mailboxFactory;

const ROUTES = {
  inbox: 'inbox',
  sent: 'sent',
  archive: 'archive',
  compose: 'compose',
  email: 'email'
}


const MAILBOX_TYPES = {
  [ROUTES.inbox]: 'inbox',
  sent: 'sent',
  archive: 'archive'
}



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

function init() {
  router = createRouter()
  httpService = createHttpService(fetch, API_PATHS);
  mailboxFactory = createMailboxFactory();

  // listen to the compose send event
  listenComposeForm();
}



document.addEventListener('DOMContentLoaded', function() {

  init();

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => {
    router.moveTo(ROUTES.inbox);
  });
  document.querySelector('#sent').addEventListener('click', () => {
    router.moveTo(ROUTES.sent);
  });
  document.querySelector('#archived').addEventListener('click', () => {
    router.moveTo(ROUTES.archive);
  });
  document.querySelector('#compose').addEventListener('click', () => {
    router.moveTo(ROUTES.compose);
  });


  router.moveTo(ROUTES.inbox);
});
//  ----- !Initial 


//  ----- View Domain 
class Renderer {
  


  get noResultContent() {
    const p = this.createElement('p', 'no-result-msg');
    const textNode = document.createTextNode('No result');
    p.appendChild(textNode);

    return p;
  };

  static hideEl = el => {
    el.style.display = 'none';
  };
  static showEl = el => {
    el.style.display = 'block';
  };

  static checkIfDomEl = el => el instanceof Element;

  static getDOMElementBySelector = selector => document.querySelector(selector);

  static clear(el) {
    if (!Renderer.checkIfDomEl(el)) throw new Error(`Please, pass the valid DOM el. Received: ${el}, ${typeof el} `);

    el.replaceChildren();
  }


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

  render(el, content) {
    if (!Renderer.checkIfDomEl(el)) throw new Error(`Please, pass the valid DOM el. Received: ${el}, ${typeof el} `);

    const finalContent = content || this.noResultContent;
    
    el.appendChild(finalContent);
    return this;
  }


  renderMany(el, ...children) {
    if (!Renderer.checkIfDomEl(el)) throw new Error(`Please, pass the valid DOM el. Received: ${el}, ${typeof el} `);

    el.append(...children);
    return this;
  }

  
  attachEvent(el, eventName, cb) {
    if (!Renderer.checkIfDomEl(el)) throw new Error(`Please, pass the valid DOM el. Received: ${el}, ${typeof el} `);

    if (!eventName) throw new Error('Please, pass the event name');

    if (typeof cb !== 'function') throw new Error('Callback must be a function');

    // ignore options
    el.addEventListener(eventName, cb);
    return this;
  }

}

class Mailbox extends Renderer {
  type = 'inbox';

  emails;

  EmailModel;

  httpService;
  router;

  activeEmail;

  get rootEl() {
    return this.router.getActiveRouteViewEl();
  };


  constructor(params) {

    const { emailsViewSelector, emailViewSelector, EmailModel, httpService, router } = params;
  
    super()

    this.httpService = httpService;
    this.router = router;
  
    this.emailsViewEl = Renderer.getDOMElementBySelector(emailsViewSelector);
    this.emailViewEl = Renderer.getDOMElementBySelector(emailViewSelector);

    this.EmailModel = EmailModel;
  }

  setHttpService = (httpService) => {
    this.httpService = httpService;
  }
  setRouter = (router) => {
    this.router = router;
  }

  renderActiveModeEl = (elToRender, elToHide) => {
    Renderer.hideEl(elToHide);
    Renderer.showEl(elToRender)
  }

  setEmails(emailsData ) {
    this.emails = emailsData.map(o => this.createNewEmailModel(o))

    return this;
  }

  createNewEmailModel = (data) => {
    return new this.EmailModel(data)
    .setMailboxType(this.type)
    .setOnPreviewClickCb(this.onEmailPreviewClick)
    .setOnArchiveClickCb(this.onArchiveClick)
    .setOnReplyClickCb(this.onReplyClick);
  }

  renderTitle() {
    const content = this.title;
    if (!content) return null;
    let titleEl = Renderer.getDOMElementBySelector('h3.mailbox-title')

    // already exists so just need to replace node
    if (titleEl) {
      Renderer.clear(titleEl);
    } else {
      // doesn't need - need to create
      titleEl = super.createElement('h3', 'mailbox-title');
    }

    const text = super.createTextNode(content);
    super.render(titleEl, text);
    super.render(this.rootEl, titleEl);

  }


  renderEmailPreviews() {

    this.renderTitle()

    this.emails.forEach(emailModel => {
      const emailPreviewNode = emailModel.getPreviewNode();
      super.render(this.rootEl, emailPreviewNode);
    });
  }

  renderEmail() {
    this.router.moveTo(ROUTES.email);
   
    const emailFullNode = this.activeEmail.getFullNode();
    this.renderTitle()
    super.render(this.rootEl, emailFullNode);
  }



  onEmailPreviewClick = (emailJson) => {
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
        this.activeEmail = this.createNewEmailModel(res);
       this.renderEmail();
       
       if (!read) {
        this.httpService.updateEmail(id, {
          ...emailJson,
          read: true
        })
       }
       
      })
      .catch(handleErrors)
  }

  onArchiveClick = (emailJson) => {
    const id = emailJson.id;
    
    let payload = {...emailJson};

    if (this.type === MAILBOX_TYPES.archive) {
      payload.archived = false;
    } else {
      payload.archived = true;
    }



    this.httpService.updateEmail(id, payload)
      .then(() => {
        this.router.moveTo(ROUTES.inbox)
      });
  }

  onReplyClick = (emailJson) => {
    console.log('MAILBOX onReplyClick => ', emailJson); 
  }



}

class MailboxInbox extends Mailbox {

  title = "Inbox"
  type = MAILBOX_TYPES.inbox;

  constructor(params) {
   super(params); 
  }
}
class MailboxSent extends Mailbox {

  title = "Sent"
  type = MAILBOX_TYPES.sent;

  constructor(params) {
    super(params); 
  }

  render() {
    console.log(' MAIL BOX INBOX RENDER')
    super.render();
  }
}
class MailboxArchive extends Mailbox {

  title = "Archived"
  type = MAILBOX_TYPES.archive;

  constructor(params) {
    super(params); 
  }

}

class Email extends Renderer {
  id;
  sender;
  recipients;
  subject;
  body;
  timestamp;
  read;
  archived;

  mailboxType;

  __onPreviewClickCb;
  __onReplyClickCb;
  __onArchiveClickCb;

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
  setOnReplyClickCb(onReplyClickCb) {
    if (typeof onReplyClickCb !== 'function') {
      throw new Error('Callback must be a function');
    }
    this.__onReplyClickCb = (_clickEvent) => onReplyClickCb(this.serialize());

    return this;
  }
  setOnArchiveClickCb(onArchiveClickCb) {
    if (typeof onArchiveClickCb !== 'function') {

      throw new Error('Callback must be a function');
    }
    this.__onArchiveClickCb = (_clickEvent) => onArchiveClickCb(this.serialize());

    return this;
  }

  setMailboxType = (type) => {
    this.mailboxType = type;
    return this;
  };

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
    const actionsPanelEl = this.getActionsPanelEl();
    const bodyEl = this.getFullNodeBodyEl()

    super.renderMany(wrapperEl, headerEl, actionsPanelEl, bodyEl);

    return wrapperEl;
  }

  getActionsPanelEl = () => {
    const panelEl = super.createElement('div', 'mail-actions');
    const replyBtnEl = this.getReplyBtnEl();

    super.render(panelEl, replyBtnEl);


    if (this.mailboxType !== MAILBOX_TYPES.sent) {
      const archiveBtnEl = this.getArchiveBtnEl();
      super.render(panelEl, archiveBtnEl)
    }

    return panelEl;
  }

  getReplyBtnEl() {
    const btnEl = super.createElement('button', 'mail-reply btn btn-primary')
    super.fillElByTextNode(btnEl, 'Reply');
    
    super.attachEvent(btnEl, 'click', this.__onReplyClickCb);

    return btnEl;
  }


  getArchiveBtnEl() {
    const btnEl = super.createElement('button', 'mail-archive btn btn-primary')
    const text = this.mailboxType === MAILBOX_TYPES.archive ? 'Unarchive' : 'Archive'
    super.fillElByTextNode(btnEl, text);

    super.attachEvent(btnEl, 'click', this.__onArchiveClickCb);

    return btnEl;
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

function listenComposeForm() {
  const id = 'compose-form';
  if (!id) throw new Error('Please, pass the id of the compose form');
  
  const formEl = document.forms[id];
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
      router.moveTo(ROUTES.sent)
    })
    .catch(handleErrors)

  })
}
//  ----- !View Domain 

//  ----- Error handling
function handleErrors(error) {
  switch (error) {
    case ERRORS.noRecepient:
      alert('NO RECEPIENT');
      console.error(error);
      break;
    case ERRORS.userNotExists:
      alert('USER DOES NOT EXISTS');
      console.error(error);
      break;
    case ERRORS.invalidMailbox:
      alert('INVALID MAILBOX');
      console.error(error);
      break;
    default:
      alert('SOME ERRRO HAPPENED: ' + error)
      console.error(error);
      break;
    }
}
//  ----- !Error handling



//  ----- Api layer
//  Http client should have post/get interfaces but let's just omit it
let createHttpService = ((httpClient, API_PATHS) => { 

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

  function updateEmail(emailId, data) {

    return httpClient(API_PATHS.getEmailPath(emailId), {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    .then(reponseHandler)
  }


  return {
    sendEmail,
    getMailboxEmails,
    getMailboxEmail,
    updateEmail
  }
});

function loadMailboxEmails(mailbox) {
    
  if (!mailbox) throw new Error('Please, pass the correct mailbox')

  httpService.getMailboxEmails(mailbox)
    .then(res => {
      console.log('res', res)
      const inbox = mailboxFactory.getInstance(mailbox, {
        emailsViewSelector: '#emails-view', EmailModel: Email, emailViewSelector: '#email-view', httpService, router})
      inbox.setEmails(res)
      .renderEmailPreviews()
    })
    .catch(handleErrors)
 
}
//  ----- !Api layer

//  ----- Core
let createMailboxFactory = (() => {

  const registry = {
    [MAILBOX_TYPES.inbox]: MailboxInbox,
    [MAILBOX_TYPES.sent]: MailboxSent,
    [MAILBOX_TYPES.archive]: MailboxArchive,
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


});

let createRouter = (() => {

  let activeRouteName;

  const viewElCache = {
    [ROUTES.inbox]: {
      selector: '#emails-view',
      element: null
    },
    [ROUTES.sent]: {
      selector: '#emails-view',
      element: null
    },
    [ROUTES.archive]: {
      selector: '#emails-view',
      element: null
    },
    [ROUTES.compose]: {
      selector: '#compose-view',
      element: null
    },
    [ROUTES.email]: {
      selector: '#email-view',
      element: null
    },
  }

  const getViewEl = (viewName) => {
    let {element, selector} = viewElCache[viewName];
    if (!element) {
      element = viewElCache[viewName].element = Renderer.getDOMElementBySelector(selector)

      return element;
    }

    return element;
  }

  const showEl = (routeName) => {
    const viewEl = getViewEl(routeName);
    Renderer.showEl(viewEl);
  }
  
  /**
   * routeName {string} - name of the route
   * skipClear {boolean} - if true the clear won't happen. Need for the static content as ComposeMail
   */
  const generateDestroyHandler = (routeName, skipClear) => () => {
    const viewEl = getViewEl(routeName);
    if (!skipClear) {
      Renderer.clear(viewEl);
    }

    Renderer.hideEl(viewEl);

  }
  

  const CONFIG = {
    // for the future feature: history
    [ROUTES.inbox]: {
      path: '/inbox',
      getViewEl: () => getViewEl(ROUTES.inbox),
      component: {
        render: () => {
          showEl(ROUTES.inbox);
          loadMailboxEmails(ROUTES.inbox);
        },
        destroy: generateDestroyHandler(ROUTES.inbox),
      }
    },
    [ROUTES.sent]: {
      path: '/inbox',
      getViewEl: () => getViewEl(ROUTES.sent),
      component: {
        render: () => {
          showEl(ROUTES.sent);
          loadMailboxEmails(ROUTES.sent);
        },
        destroy: generateDestroyHandler(ROUTES.sent),
      }
    },
    [ROUTES.archive]: {
      path: '/inbox',
      getViewEl: () => getViewEl(ROUTES.archive),
      component: {
        render: () => {
          showEl(ROUTES.archive);
          loadMailboxEmails(ROUTES.archive);
        },
        destroy: generateDestroyHandler(ROUTES.archive),
      }
    },
    [ROUTES.compose]: {
      path: '/compose',
      getViewEl: () => getViewEl(ROUTES.compose),
      component: {
        render: () => {
          showEl(ROUTES.compose);
        },
        destroy: generateDestroyHandler(ROUTES.compose, true),
      }
    },
    [ROUTES.email]: {
      path: '/email',
      getViewEl: () => getViewEl(ROUTES.email),
      component: {
        render: () => {
          showEl(ROUTES.email);
        },
        destroy: generateDestroyHandler(ROUTES.email),
      }
    }
  }
  

  const moveTo = (routeName) => {
    const routeConfig = CONFIG[routeName];
    if (!routeConfig) {
      throw new Error(`There is no such route ${routeName}`);
    }


    // should remove the prev component if exists
    if (activeRouteName) {
      CONFIG[activeRouteName].component.destroy();
    }
   
    activeRouteName = routeName;
    routeConfig.component.render();

  }


  const getActiveRouteViewEl = () => {
    return CONFIG[activeRouteName].getViewEl()
  }

  return {
    activeRouteName,
    getActiveRouteViewEl,
    moveTo
  }
})


//  ----- !Core
