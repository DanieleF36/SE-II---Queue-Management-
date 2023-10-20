import dayjs from "dayjs";

const URL = 'http://localhost:3001/api/';

async function getAllPublishedPages(){
    const res = await fetch(URL+"pages");
    const pages = await res.json();
    if (res.ok) {
        return pages.map((e) => (new Pages(e.id, e.title,e.author, -1, undefined, dayjs(e.publicationDate))));
    } else {
        throw pages;
    }
}


async function getOpenedPage(id){
    const res = await fetch(URL+"pages/"+id);
    const  page = await res.json();
    if(res.ok){
        let p = new Pages(page.id, page.title, page.author,-1, dayjs(page.creationDate), page.publicationDate?dayjs(page.publicationDate):"");
        page.order.map((e)=>{
            if(e.text){
                p.addParagraph(new Paragraph(e.text, e.pos));
            }
            else if(e.header){
                p.addHeader(new Header(e.header, e.pos))
            }
            else{
                p.addImage(new Image(e.url, e.pos, e.id));
            }
        })
        return p;
    }
    else {
        throw page;
    }
}

const API = {};

export default API;