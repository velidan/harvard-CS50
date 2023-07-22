//  ----- Initial
let httpService;
let router;
let mailboxFactory;
let composeForm;
let navigation;

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
  composeForm = new ComposeForm(httpService, navigation);
  navigation = new Navigation(router);

  navigation.activateNavRoute(ROUTES.inbox);
}

document.addEventListener('DOMContentLoaded', init);

//  ----- !Initial 


//  ----- View Domain 

class Navigation {
  
  navItemsSelectorsRegistry = {
    [ROUTES.inbox]: '#inbox',
    [ROUTES.sent]: '#sent',
    [ROUTES.archive]: '#archived',
    [ROUTES.compose]: '#compose',
  }

  activeClassName = 'active';

  router;

  activeEl;
  activeRouteName;

  constructor(router) {
    this.router = router;
    this.attachListeners();
  }

  attachListeners() {
    for (const [key, selector] of Object.entries(this.navItemsSelectorsRegistry)) {
      const navEl = Renderer.getDOMElementBySelector(selector);
      Renderer.attachEvent(navEl, 'click', this.onNavItemClick.bind(this, key));
    }
  }

  onNavItemClick = (routeName, _event) => {
    this.activateNavRoute(routeName);
  }


  activateNavItemByRouteName = (routeName) => {
    const selector = this.navItemsSelectorsRegistry[routeName];
    if (!selector) {
      throw new Error(`route does not exists ${routeName}`);
    }
    const navEl = Renderer.getDOMElementBySelector(selector);

    // deactivate previously active item
    if (this.activeEl) {
      Renderer.removeClassListFromEl(this.activeEl, this.activeClassName);
    }

    Renderer.addClassListToEl(navEl, this.activeClassName);
    this.activeEl = navEl;
    this.activeRouteName = routeName;
  }

  activateNavRoute = (routeName, routeData) => {
   
    this.activateNavItemByRouteName(routeName);
    this.router.moveTo(routeName, routeData)
  }

  deactivateCurrentActiveNavItem = () => {
    this.deactivateNavItem(this.activeRouteName);
  }

  deactivateNavItem =  (routeName) => {
    const selector = this.navItemsSelectorsRegistry[routeName];
    if (!selector) {
      throw new Error(`route does not exists ${routeName}`);
    }
    const navEl = Renderer.getDOMElementBySelector(selector);

    // deactivate previously active item
    if (this.activeEl) {
      Renderer.removeClassListFromEl(this.activeEl, this.activeClassName);
    }

    Renderer.removeClassListFromEl(navEl, this.activeClassName);
  }
}

/**
 * It should be an abstraction over the rendering engine
 * thus it would be possible to support multiplatform engine
 */
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
  static addClassListToEl = (el, className) => {
    el.classList.add(className);
  };
  static removeClassListFromEl = (el, className) => {
    el.classList.remove(className);
  };

  static checkIfDomEl = el => el instanceof Element;

  static getDOMElementBySelector = (selector, scopeEl) => {
    let res;
    if (Renderer.checkIfDomEl(scopeEl)) {
      res = scopeEl.querySelector(selector)
    } else {
      res = document.querySelector(selector)
    };

    return res;
  };
  static getFormById = id => document.forms[id];

  static clear(el) {
    if (!Renderer.checkIfDomEl(el)) throw new Error(`Please, pass the valid DOM el. Received: ${el}, ${typeof el} `);

    el.replaceChildren();
  }

  static attachEvent(el, eventName, cb) {
    if (!Renderer.checkIfDomEl(el)) throw new Error(`Please, pass the valid DOM el. Received: ${el}, ${typeof el} `);

    if (!eventName) throw new Error('Please, pass the event name');

    if (typeof cb !== 'function') throw new Error('Callback must be a function');

    // ignore options
    el.addEventListener(eventName, cb);
  }


  // basically all other stuff could be static
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
  setInnerHTML(el, text) {
    el.innerHTML = text;
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

}

class Mailbox extends Renderer {
  type = 'inbox';

  emails;

  EmailModel;

  httpService;
  router;
  navigation;

  activeEmail;

  get rootEl() {
    return this.router.getActiveRouteViewEl();
  };


  constructor(params) {

    // should be DI
    const { emailsViewSelector, emailViewSelector, EmailModel, httpService, router, navigation } = params;
  
    super()

    this.httpService = httpService;
    this.router = router;
    this.navigation = navigation;
  
    this.emailsViewEl = Renderer.getDOMElementBySelector(emailsViewSelector);
    this.emailViewEl = Renderer.getDOMElementBySelector(emailViewSelector);

    this.EmailModel = EmailModel;
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
    this.navigation.deactivateCurrentActiveNavItem();
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
        navigation.activateNavRoute(ROUTES.inbox)
      });
  }

  onReplyClick = (emailJson) => {
    navigation.activateNavRoute(ROUTES.compose, emailJson)
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

  
    Renderer.attachEvent(wrapperEl, 'click', this.__onPreviewClickCb);


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
    
    Renderer.attachEvent(btnEl, 'click', this.__onReplyClickCb);

    return btnEl;
  }


  getArchiveBtnEl() {
    const btnEl = super.createElement('button', 'mail-archive btn btn-primary')
    const text = this.mailboxType === MAILBOX_TYPES.archive ? 'Unarchive' : 'Archive'
    super.fillElByTextNode(btnEl, text);

    Renderer.attachEvent(btnEl, 'click', this.__onArchiveClickCb);

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
    // to save formatting
    const preStr = '<pre>' +   this.body  + '</pre>'

    super.setInnerHTML(bodyEl, preStr);
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

/**
 * It's possible to generate and re-create all the elements on the fly
 * but I just want to save some time as I've already spent a lot for this
 */
class ComposeForm {
  id = 'compose-form';
  httpService;
  navigation;

  formEl;
  recipientsInputEl;
  subjectInputEl;
  composeBodyTextAreaEl;

  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  constructor(httpService, navigation) {
    this.httpService = httpService;
    this.navigation = navigation;
    const formEl = Renderer.getFormById(this.id);
    this.formEl = formEl;

    if (!formEl) throw new Error(`Can't find in DOM the form with id: ${id}`)

    this.recipientsInputEl = Renderer.getDOMElementBySelector('#compose-recipients', formEl);
    // by default it's the most faster way to get the element from DOM
    this.subjectInputEl = document.getElementById('compose-subject')
    // just to demostrate other way to get the el from DOM
    this.composeBodyTextAreaEl = formEl.getElementsByTagName('textarea')?.[0];

    Renderer.attachEvent(formEl, 'submit', this.onSubmit);
  }

  onSubmit = (e) => {
      e.preventDefault();
  
      let recipients;
      let subject;
      let message;
  
      try {
        recipients = this.recipientsInputEl.value

        subject = this.subjectInputEl.value;
        message = this.composeBodyTextAreaEl.value;
      } catch (e) {
        throw new Error(e);
      }


  
      this.httpService.sendEmail(recipients, subject, message)
      .then(() => {
        navigation.activateNavRoute(ROUTES.sent)
      })
      .catch(handleErrors)
  }

  fill = (data) => {
    if (!data) return;
    const { sender, subject, timestamp, body } = data;
    this.recipientsInputEl.value = sender;
    this.subjectInputEl.value = this.getSubject(subject);
    this.composeBodyTextAreaEl.value = this.getBody(body, timestamp, sender);
  }

  getSubject = (subject) => subject.includes("Re: ") ? subject : `Re: ${subject}`;
  getBody = (body, timestamp, sender) => {
    return `On ${timestamp} ${sender} wrote:\n${body}`;
  }

  getEmailDate = () => {
    const date = new Date(Date.now());
    const year = date.getFullYear()
    const monthNumber = date.getMonth();
    const dayNumberInMonth = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const monthShortName = this.getMonthShortName(monthNumber);
    const amPmHours = this.getHoursAndMinsInAmPmFormat(hours, minutes);
    
    const result = `${monthShortName} ${dayNumberInMonth} ${year}, ${amPmHours}`;

    return result;
  }

  getHoursAndMinsInAmPmFormat = (hours, minutes) => {
    let res;
    if (hours <= 12) {
      res = `${hours}:${minutes} AM`;
    } else {
      const pmHours = hours - 12;
      res = `${pmHours}:${minutes} PM`;
    }

    return res;
  }

  getMonthShortName = (monthNumber) => this.months[monthNumber].substring(0, 3); 

  // just in case
  getRecipientsStrFromArray = recipients => {
   let str = '';
   const ln = recipients.length;
   let counter = 0;
   while(counter < ln) {
    const recipient = recipients[counter];
    // if not the last el and there is more than 1 el
    if (counter < ln - 1 && ln > 1) {
      str += `${recipient}, `;
    } else {
      str += recipient;
    }
    counter++;
   }

   return str;
  }


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
      const inbox = mailboxFactory.getInstance(mailbox, {
        emailsViewSelector: '#emails-view', EmailModel: Email, emailViewSelector: '#email-view', httpService, router, navigation})
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
        render: (data) => {
          // it's a reply. Should prefill
          if (data) {
            composeForm.fill(data);
          }
         
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
  

  const moveTo = (routeName, data) => {
    const routeConfig = CONFIG[routeName];
    if (!routeConfig) {
      throw new Error(`There is no such route ${routeName}`);
    }


    // should remove the prev component if exists
    if (activeRouteName) {
      CONFIG[activeRouteName].component.destroy();
    }
   
    activeRouteName = routeName;
    routeConfig.component.render(data);

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
