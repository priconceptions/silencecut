const FileType = require('file-type');
const fs = require('fs');


// constants
const DEFAULT_BG_COLOR = "bg-coolGray-50"
const ACTIVE_BG_COLOR = "bg-blue-100"
const ERROR_BG_COLOR = "bg-red-300"
// Buttons
const browseFSBtn = document.getElementById("browseFSBtn")


//Drag and drop
const dragSpace = document.getElementById("dragSpace")
dragSpace.addEventListener('dragover', (e) => { 
    e.preventDefault(); 
    e.stopPropagation(); 
  }); 
  
dragSpace.addEventListener('dragenter', (event) => { 
    console.log('File is in the Drop Space');
    var body = document.getElementsByTagName("BODY")[0];
    body.classList.remove(DEFAULT_BG_COLOR)
    body.classList.add(ACTIVE_BG_COLOR)
}); 
  
dragSpace.addEventListener('dragleave', (event) => { 
    console.log('File has left the Drop Space'); 
    var body = document.getElementsByTagName("BODY")[0];
    body.classList.remove(ACTIVE_BG_COLOR)
    body.classList.add(DEFAULT_BG_COLOR)
}); 

const getFileType = async (filePath) => {
    const fileType = await FileType.fromFile(filePath)
    return fileType
}

dragSpace.addEventListener('drop', (e) => {
    e.preventDefault();
    let body = document.getElementsByTagName("BODY")[0];
    let title = document.getElementById("callToActionTitle")
    let importScreen = document.getElementById("importScreen")
    for (const f of e.dataTransfer.files) {
        console.log('File(s) you dragged here: ', f.path)
        getFileType(f.path).then(resp => {
            if (resp["mime"].includes("audio") || resp["mime"].includes("video")) {
                body.classList.remove(ERROR_BG_COLOR)
                body.classList.add(DEFAULT_BG_COLOR)
                body.removeChild(importScreen)
                body.appendChild(VideoLayout(f.path))
            }
            else {
                console.log("ERRRR", title)
                title.innerHTML = "Oops! That's not an audio or video file. Please import an audio or video file!"
                body.classList.remove(DEFAULT_BG_COLOR)
                body.classList.add(ERROR_BG_COLOR)

            }
        })
    }



    body.classList.remove(ACTIVE_BG_COLOR)
    body.classList.add(DEFAULT_BG_COLOR)

});

function create(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

const VideoLayout = (filePath) => {
    let fragment = create(`
        <div id="videoLayout" class="flex-l flex-col">
            <div id="videoAndEditExport" class="flex">
                ${video(filePath)}
                ${EditExportSection()}
            </div>
            Audio Stuff here
            <div id="waveform">
                <!-- Here be the waveform -->
            </div>
        </div>
    `)
    return fragment
}


const EditExportSection = () => {
    return `
        <div class="flex flex-col w-1/3 p-6">
            <div class="flex inline-flex mx-auto my-0" role="group">
                <button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 bg-blue-500 rounded-l-md hover:bg-blue-600 hover:shadow-lg">Edit</button>
                <button type="button" class="focus:outline-none text-white text-sm py-2.5 px-5 bg-blue-500 rounded-r-md hover:bg-blue-600 hover:shadow-lg">Export</button>
            </div>   
            <div class="flex flex-col">
                Edit here
                Something else
            </div>
        </div>
    `
}

const video = (filePath) => {
    return `
    <div class="container mx-auto">
        <video controls>
        <source src="${filePath}" type="video/mp4">
        Your browser does not support the video tag.
        </video>
    </div>
    `
}
