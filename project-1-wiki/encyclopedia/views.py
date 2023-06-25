from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound, HttpResponseRedirect
from django.http import Http404
from django import forms
from django.urls import reverse
from django.http import HttpResponseRedirect

import logging
from . import util



logger = logging.getLogger('django')

class SearchForm(forms.Form):
    q = forms.CharField(label="", widget=forms.TextInput(attrs={'class':'search'}))

class CreateForm(forms.Form):
    title = forms.CharField(label="Title", widget=forms.TextInput(attrs={'class':'field create-title'}))
    content = forms.CharField(widget=forms.Textarea(attrs={"rows":"5"}))

class EditForm(forms.Form):
    content = forms.CharField(widget=forms.Textarea(attrs={"rows":"5"}))


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries(),
        "form": SearchForm()
    })

def page(request, title):
    entry = util.get_entry(title)
    # content =  if entry else HttpResponseNotFound("<h1>Page not found</h1>")

    if not entry:
        return  render(request, 'encyclopedia/custom_404.html', {
        "title": title
    })

    return render(request, 'encyclopedia/page.html', {
        "title": title,
        "entry": entry
    })

def search(request):
    if request.method == "POST":
        query = request.POST['q'].lower()
        entries = util.list_entries()
        entries_lowercased = [x.lower() for x in entries]
        if query in entries_lowercased:
            return HttpResponseRedirect(reverse("page", kwargs={"title": query}))
        else:
            return HttpResponseRedirect(reverse("search_result", kwargs={"query": query}))

   

def search_result(request, query):
    
    entries = util.list_entries()
    query_lowercased = query.lower()

    matches = []

    for value in entries:
        if query_lowercased in value.lower():
            matches.append(value)
        
    return render(request, "encyclopedia/search_result.html", {
        "entries": matches,
        "query": query_lowercased
    })

def create_new_entity(request):
    exist_error = None      
    if request.method == "POST":
 
        entries = util.list_entries()
        title = request.POST['title']
        print("title: {title}".format(title=title))
        print("entries: {entries}".format(entries=entries))
        # exists entity
        if title in entries:
            print("error")
            exist_error = 'Sorry. This page already exists'
        else:
            form = CreateForm(request.POST)
            if form.is_valid():
                title_clean = form.cleaned_data["title"]
                content_clean = form.cleaned_data["content"]
                util.save_entry(title_clean, content_clean)
                return HttpResponseRedirect(reverse("page", kwargs={"title": title_clean}))
            else:
                print('invalid form data')

    # else:


    return render(request, "encyclopedia/create_page.html", {
        "form": SearchForm(),
        "create_form": CreateForm(),
        "exist_error": exist_error
    })

def edit(request, title):

    if request.method == "POST":
        form = EditForm(request.POST)
        if form.is_valid():
            content_clean = form.cleaned_data["content"]
            util.save_entry(title, content_clean)
            return HttpResponseRedirect(reverse("page", kwargs={"title": title}))

    else:
        entry = util.get_entry(title)
        print("entry: {entry}".format(entry=entry))

        return  render(request, "encyclopedia/edit_page.html", {
        "form": SearchForm(),
        "edit_form": EditForm(initial={ 'content': entry}),
        "title": title,
        })

    # return HttpResponseRedirect(reverse("index"))




def delete(request, title):
    util.delete_entry(title)
    return  HttpResponse("<p>Deleted</p>")

# def page_not_found_view(request, exception):
#     return render(request, 'encyclopedia/custom_404.html', status=404)