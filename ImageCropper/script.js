let fileInputs = document.querySelectorAll('[data-image-preview]')


let croppingBox = document.querySelector('.cropping-box'),
    img_result = document.querySelector('.img-result'),
    img_w = document.querySelector('.img-w'),
    img_h = document.querySelector('.img-h'),
    options = document.querySelector('.add-product-options'),
    crop = document.querySelector('.crop'),
    cropper = '',
    currentInput = null,
    imgNames = null;
    let imgSrc = null;

fileInputs.forEach(fileInput => {
    fileInput.addEventListener('change', () => {
        let previewDiv = document.querySelector(fileInput.dataset.imagePreview)
        previewDiv.innerHTML = ""
        for (let each of fileInput.files) {
            let imgSrc = URL.createObjectURL(each)
            let img = document.createElement('img')
            img.src = imgSrc
            img.dataset.fileName = each.name
            console.log(fileInput.id , 'file inut id')
            img.dataset.input = fileInput.id
            img.addEventListener('click', cropImage)

            previewDiv.append(img)

        }
    })
})


function cropImage(e) {
    console.log('crop event occured')
    document.getElementById('cropperModal').style.display = 'block'
 

    let img = document.createElement('img');
    img.id = 'image';
    img.src = e.target.src;
    croppingBox.innerHTML = '';
    croppingBox.appendChild(img);
    cropper = new Cropper(img);

    imgNames = e.target.dataset.fileName
    currentInput = e.target.dataset.input

}



// save on click
crop.addEventListener('click', e => {
    e.preventDefault();
    // get result to data uri

    let imgSrc = cropper.getCroppedCanvas({
        width: img_w.value // input value
    }).toDataURL();
   
    if (imgSrc && imgNames !== null) {
        let fileUploader = document.getElementById(currentInput)
        console.log('b4ewrerer')
        console.log(fileUploader.files)
        console.log(imgNames)
        fetch(imgSrc)
            .then(res => res.blob())
            .then(blob => {
                console.log(imgNames)
                let file = new File([blob], `${imgNames}-${Date.now()}.png`, { type: "image/jpeg" })

                const dt = new DataTransfer()
                for (let each of fileUploader.files) {
                    if (each.name !== imgNames) {
                        dt.items.add(each)
                    }
                }
                dt.items.add(file)

                fileUploader.files = dt.files

                console.log(fileUploader.files)

                let previewDiv = document.querySelector(fileUploader.dataset.imagePreview)
                previewDiv.innerHTML = ""
                let res = ""

                for (let each of fileUploader.files) {
                    let src = URL.createObjectURL(each)
                    res += `<img src="${src}" data-file-name="${each.name}" data-input="${fileUploader.id}" onclick="cropImage(event)" class="previewImages">`
                }

                previewDiv.innerHTML = res


            })
    }

    closeCropBox()
   
});


function closeCropBox() {
    document.getElementById('cropperModal').style.display = 'none'
}