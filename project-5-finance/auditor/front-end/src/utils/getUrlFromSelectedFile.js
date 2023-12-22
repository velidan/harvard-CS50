export function getUrlFromSelectedFile(inputFiles, callback) {
    if (inputFiles && inputFiles[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            callback(e.target.result)
        }

        reader.readAsDataURL(inputFiles[0]);
    }
}