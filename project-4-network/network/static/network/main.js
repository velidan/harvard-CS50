let httpService;

const API_PATHS = {
    updatePost: '/update-post'
    // emails: '/emails',
    // getMailboxPath(mailbox) {
    //   if (!mailbox) throw new Error('Please, pass the mailbox type you want to get');
  
    //   return `${this.emails}/${mailbox}`
    // },
    // getEmailPath(id) {
    //   if (!id) throw new Error('Please, pass the id of the mail you want to get');
  
    //   return `${this.emails}/${id}`
    // }
  };

document.addEventListener('DOMContentLoaded', init);

function init() {
    httpService = createHttpService(fetch, API_PATHS);

    new EditPost(httpService);
}

class EditPost {
    btnId = 'editBtn';
    httpService;
    

    activeEditPostData = {
        rootEl: null,
        bodyEl: null,
        actionPanelEl: null,
        textAreaEl: null,
        oldValue: null,
        currentValue: null,
        authorId: null,
        postId: null,
    }
    

    constructor(httpClient) {
        this.httpService = httpClient;

        this.attachEvents()
    }

    attachEvents = () => {
        const btns = document.querySelectorAll(`.${this.btnId}`);
        console.log("btns -> ", btns);
        Array.from(btns).forEach(element => {
            element.onclick = this.handleEditBtnClick;
        });
    }

    handleEditBtnClick = (e) => {
        const postId = e.target.dataset.postId;
        console.log('>>> handle edit btn click <<< ', e, postId);

        const parentEl = document.getElementById(`post-${postId}`)
        const authorId = parentEl.dataset.authorId;
        parentEl.classList.add('edit-mode');
        const parentPostBodyEl = parentEl.querySelector('.postBody')

        const textAreaEl = document.createElement('textarea')

        const oldPostValue = parentPostBodyEl.textContent;

        textAreaEl.value = oldPostValue;

        const actionPanelEl = parentEl.querySelector('.action-panel');
        const saveBtnEl = document.createElement('button');
        saveBtnEl.textContent = 'Save';
        saveBtnEl.onclick = this.handleEditSaveClick;
        actionPanelEl.replaceChildren(saveBtnEl);

        parentPostBodyEl.replaceChildren(textAreaEl);

        this.activeEditPostData = {
            rootEl: parentEl,
            bodyEl: parentPostBodyEl,
            textAreaEl,
            actionPanelEl,
            oldValue: oldPostValue,
            currentValue: oldPostValue,
            authorId,
            postId
        }

    }

    handleEditSaveClick = (e) => {
        console.log('SAVING', e, this.activeEditPostData.textAreaEl.value)

        this.httpService.updatePost({
            content: this.activeEditPostData.textAreaEl.value,
            authorId: this.activeEditPostData.authorId,
            postId: this.activeEditPostData.postId,
        })
            .then((res) => {
                const postBodyEl = this.activeEditPostData.bodyEl;
                postBodyEl.innerHTML = res.content; 


                const editBtnEL = document.createElement('button');
                editBtnEL.classList.add('editBtn')
                editBtnEL.dataset.postId = this.activeEditPostData.postId;
                editBtnEL.textContent = 'Edit';
                editBtnEL.onclick = this.handleEditBtnClick;
                this.activeEditPostData.actionPanelEl.replaceChildren(editBtnEL); 
            })

        
    }


}



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
  
    function updatePost(payload) {
  
      return httpClient(API_PATHS.updatePost, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      .then(response =>  response.json())
      .then(reponseHandler)
    }
  
    // function getMailboxEmails(mailbox) {
  
    //   return httpClient(API_PATHS.getMailboxPath(mailbox))
    //   .then(response => response.json())
    //   .then(reponseHandler)
    // }
  
    // function getMailboxEmail(emailId) {
  
    //   return httpClient(API_PATHS.getEmailPath(emailId))
    //   .then(response => response.json())
    //   .then(reponseHandler)
    // }
  
    // function updateEmail(emailId, data) {
  
    //   return httpClient(API_PATHS.getEmailPath(emailId), {
    //     method: 'PUT',
    //     body: JSON.stringify(data)
    //   })
    //   .then(reponseHandler)
    // }
  
  
    return {
        updatePost
    }
  });