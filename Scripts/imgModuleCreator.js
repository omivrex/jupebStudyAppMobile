const fs = require('fs')
const imgArray = []

const courses = [
    'maths',
    'physics',
    'chemistry',
    'biology'
]

const years = [
    '2018',
    '2019',
    '2020',
]

const subjects = [
    '001',
    '002',
    '003',
    '004',
]

const sections = [
    'obj',
    'theory',
]

const parts = [
    'questions',
    'answers',
]

const folders = []

function main() {
    createPathsToSearch()

    folders.forEach(path => {
       getFiles(path) 
    })

    console.log(    imgArray);

    fs.writeFileSync('./imageUrl.js', `module.exports.images = [ ${imgArray.toString()}]`)
}

function createPathsToSearch() {
    courses.forEach(course => {
        years.forEach(year => {
            subjects.forEach(subject => {
                sections.forEach(section => {
                    parts.forEach(part => {
                        folders.push(`../PastQuestions/${course}/${year}/${subject}/${section}/${part}`)
                    });
                });
            });
        });
    });
}

function getFiles(folderPath) {
    fs.readdirSync(folderPath, {withFileTypes: true}).forEach(dirent => {
        if (dirent.isFile() && dirent.name.includes('jpg'||'JPG') === true) {
            const newFileName = dirent.name.replace('.JPG', '.jpg') // expo doesnt allow capital letters as ext name
            const imgPath = `${folderPath}/${newFileName}`
            if (folderPath.indexOf('obj/answers') != -1) { // if its under obj answers
                if (newFileName.indexOf('-') != -1) { // if the img has its answer attached to the name
                    imgArray.push(`{
                        key: '${imgPath}',
                        correctAns: '${newFileName.slice(newFileName.indexOf('-')+1, newFileName.lastIndexOf('.'))}',
                        userAns: '',
                        url: require(\'${createJsonFile(`${imgPath}`)}\')
                    }`)
                } else {
                    imgArray.push(`{
                        key: '${imgPath}',
                        correctAns: 'N/A',
                        userAns: '',
                        url: require(\'${createJsonFile(`${imgPath}`)}\')
                    }`)
                }
                
            } else { //if its a questiion
                imgArray.push(`{
                    key:' ${imgPath}',
                    url: require(\'${createJsonFile(`${imgPath}`)}\')
                }`)
            }

            if (dirent.name.includes('JPG')) {
                fs.renameSync(`${folderPath}/${dirent.name}`, `${imgPath}`)
            }
        }
    });
}

const createJsonFile = imgPath => {
    console.log(imgPath);
    const img_Base64_Path = fs.readFileSync(imgPath).toString('base64')
    const jsonUrl = imgPath.replace('jpg', 'json')
    // fs.writeFileSync(jsonUrl, `{"base64Url": "${img_Base64_Path}"}`)
    try {
        fs.unlink(jsonUrl, () => {
            console.log('succesfully deleted json file');
        })
        
    } catch (error) {
        
    }
    return imgPath
}

main() 
