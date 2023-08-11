let httpService;

const API_PATHS = {
    updatePost: '/update-post',
    likePost: '/like-post'
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
    new LikePost(httpService);
}

class EditPost {
    btnSelector = '.editBtn';
    rootElSelector = '.editBtn';
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

        // this.attachEvents()
        document.addEventListener('click', this.handleDocumentClick);
    }

    handleDocumentClick = e => {
        const targetEl = e.target;
        const editBtnEl = targetEl.closest(this.btnSelector)
        if (!editBtnEl) return;

        const postId = editBtnEl.dataset.postId;

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

    // attachEvents = () => {
    //     const btns = document.querySelectorAll(this.btnSelector);
    //     console.log("btns -> ", btns);
    //     Array.from(btns).forEach(element => {
    //         element.onclick = this.handleEditBtnClick;
    //     });
    // }

    // handleEditBtnClick = (e) => {
    //     const postId = e.target.dataset.postId;
    //     console.log('>>> handle edit btn click <<< ', e, postId);

    //     const parentEl = document.getElementById(`post-${postId}`)
    //     const authorId = parentEl.dataset.authorId;
    //     parentEl.classList.add('edit-mode');
    //     const parentPostBodyEl = parentEl.querySelector('.postBody')

    //     const textAreaEl = document.createElement('textarea')

    //     const oldPostValue = parentPostBodyEl.textContent;

    //     textAreaEl.value = oldPostValue;

    //     const actionPanelEl = parentEl.querySelector('.action-panel');
    //     const saveBtnEl = document.createElement('button');
    //     saveBtnEl.textContent = 'Save';
    //     saveBtnEl.onclick = this.handleEditSaveClick;
    //     actionPanelEl.replaceChildren(saveBtnEl);

    //     parentPostBodyEl.replaceChildren(textAreaEl);

    //     this.activeEditPostData = {
    //         rootEl: parentEl,
    //         bodyEl: parentPostBodyEl,
    //         textAreaEl,
    //         actionPanelEl,
    //         oldValue: oldPostValue,
    //         currentValue: oldPostValue,
    //         authorId,
    //         postId
    //     }

    // }

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


class LikePost {
    likeBtnSelector = ".like-btn";
    rootPostElSelector = ".post-root";
    likeCountElSelector = ".like-count";
    // should be added to the root el of the post
    likedClassName = 'liked';


    httpService;


    likeBtnEl = null

    constructor(httpClient) {
        this.httpService = httpClient;

        document.addEventListener('click', this.handleDocumentClick);
    }

    handleDocumentClick = e => {
        const targetEl = e.target;
        this.likeBtnEl = targetEl.closest(this.likeBtnSelector)
        if (!this.likeBtnEl) return;

        const postId = this.likeBtnEl.dataset.postId;

        this.httpService.likePost({
            postId,
            // like: true
        }).then(res => {
            const parentEl = this.likeBtnEl.closest(this.rootPostElSelector);
            const likeCountEl = parentEl.querySelector(this.likeCountElSelector);
            if (res.like) {
                parentEl.classList.add(this.likedClassName)
            } else {
                parentEl.classList.remove(this.likedClassName)
            }
            likeCountEl.textContent = res.post_likes_count;
        })


        console.log(`target el =>> ${postId}`);
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
    function likePost(payload) {
  
      return httpClient(API_PATHS.likePost, {
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
        updatePost,
        likePost
    }
  });