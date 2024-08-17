// json files + scroll and blur for test + score calcualtion + modal
async function loadContent () {
    const questionsResponse = await fetch('questions.json')
    const questions = await questionsResponse.json()
    const questionsContainer = document.getElementById('questions-container')
    const form = document.getElementById('psychological-test')
    const motivation = document.getElementById('motive')

    let currentQuestionIndex = 0

    const answeredQuestions = new Set()

    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div')
        questionDiv.className = 'qContainer blurred'
        questionDiv.id = `question${index}`
        questionDiv.innerHTML = `<label for="questions${index}">${q.question}</label>`

        q.answers.forEach(answer => {
            questionDiv.innerHTML += `<input type="radio" id="q${index}${answer.value}" name="question${index}" value="${answer.value}">
            <label for="q${index}${answer.value}">${answer.text}</label>`
        })

        questionDiv.addEventListener('change', event => {
            answeredQuestions.add(index);
            if (index < questions.length - 1) {
                currentQuestionIndex++;
                showCurrentQuestion();
            }
        })

        questionsContainer.appendChild(questionDiv)
    })

    function showCurrentQuestion () {
        const allQuestions = document.querySelectorAll('.qContainer')
        allQuestions.forEach((q, idx) => {
            // console.log(answeredQuestions.has(idx));
            if (idx === currentQuestionIndex || answeredQuestions.has(idx)) {
                q.classList.remove('blurred');
            } else {
                q.classList.add('blurred');
            }
        })

        if (currentQuestionIndex < questions.length) {
            allQuestions[currentQuestionIndex].scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest"
            })
        }
    }

    questionsContainer.addEventListener('click', (event) => {
        const clickedQuestion = event.target.closest('.qContainer')
        if (clickedQuestion) { //with a little help
            const clickedIndex = Number(clickedQuestion.id.replace('question', ''))
            if (answeredQuestions.has(clickedIndex)) {
                currentQuestionIndex = clickedIndex
                showCurrentQuestion()
            }
        }
    })

    showCurrentQuestion()
    form.addEventListener('submit', function(event) {
        event.preventDefault()

        let totalScore = 0
        const numberOfQuestions = questions.length
        let hasAnswers = true

        for (let i = 0; i < numberOfQuestions; i++) {
            const answer = document.querySelector(`input[name="question${i}"]:checked`)

            if (answer) {
                const answerValue = Number(answer.value)
                if (!isNaN(answerValue)) {
                    totalScore += answerValue
                }
            } else {
                hasAnswers = false
            }
        }
        if (!hasAnswers) {
            alert("لطفا به تمام سوالات پاسخ دهید.")
            return
        }

        let scoreCategory;
        if (totalScore > 46 && totalScore <= 96) {
            scoreCategory = "پایین" 
            motivation.innerText = 'مثل اینکه واقعا نیاز به پادکست و 100 دلیل داری...'
        } else if (totalScore > 96 && totalScore <= 144) {
            scoreCategory = "متوسط"
            motivation.innerText = 'یکم بیشتر خودت رو دوست داشته باش عزیز من'
        } else if (totalScore > 144 && totalScore <= 240) {   
            scoreCategory = "بالا"
            motivation.innerText = 'بابا ایول بهتتت :)'
        } else {   
            scoreCategory = "نمره نامعتبر"
        }

        // modal with results
        const name = document.getElementById('name')
        const modal = document.getElementById('score-modal')
        const scoreResult = document.getElementById('score-result')
        const modaltoReasons = document.getElementById('modal-link')

        scoreResult.textContent = `${name.value} تو با نمره‌ی ${totalScore} در دسته افراد با امید به زندگی ${scoreCategory} هستی :)`
        modal.style.display = "block"

        function closeModal () {
            modal.style.display = "none"
        }
        // close with button
        const closeButton = document.querySelector('.close-button')
        closeButton.addEventListener('click', closeModal)

        modaltoReasons.addEventListener('click', closeModal)
         
        // close when clicking outside of modal 
        window.addEventListener('click', function (event) {
            if (event.target === modal) {
                modal.style.display = "none"
            }
        })
    })

    // load 100 reasons
    const reasonsResponse = await fetch('reasons.json')
    const reasons = await reasonsResponse.json()
    const reasonsContainer = document.getElementById('reasons-container')
    const ol = document.createElement('ol')

    reasons.forEach(reason => {
        const li = document.createElement('li')
        li.textContent = reason

        ol.appendChild(li)
    })

    reasonsContainer.appendChild(ol)
}

loadContent()

// ----------------sidebar--------------------
function toggleNav () {
    let sidebar = document.getElementById('sidebar')
    if (sidebar.style.right === "0px") {
        sidebar.style.right = "-350px"
    } else {
        sidebar.style.right = "0px"
    }
}

const sidebarLinks = document.querySelectorAll('.sidebar a')
sidebarLinks.forEach(link => {
    link.addEventListener('click', function () {
        toggleNav()
    })
})
// --------------adjusting size--------------------
let nav = document.getElementById('nav')
let navbar = document.getElementById('header-ul')

function removeNavbar () {
    if (navbar) {
        navbar.parentNode.removeChild(navbar)
        navbar = null
    }
}

function addNavbar () {
    if(!navbar) {
        const newNavbar = document.createElement('ul')
        newNavbar.id = 'header-ul'

        const items = [
            { href: '#home', text: 'صفحه اصلی' },
            { href: '#test', text: 'تست روانشناسی' },
            { href: '#reasons', text: '100 دلیل' },
            { href: '#podcast', text: 'پادکست' },
            { href: '#music', text: 'انگیزشی' },
            { href: '#about', text: 'اطلاعات بیشتر' },
            { href: '#nastaran', text: 'ارتباط با من' }
        ]

        items.forEach(item => {
            const listItem = document.createElement('li')
            const anchor = document.createElement('a')
            anchor.href = item.href
            anchor.textContent = item.text
            listItem.appendChild(anchor)
            newNavbar.appendChild(listItem)
        })

        nav.appendChild(newNavbar)
        navbar = newNavbar
    }
}

function checkWindowSize () {
    if (window.innerWidth < 1050) {
        removeNavbar()
    } else {
        addNavbar()
    }
}

window.addEventListener('resize', checkWindowSize)

document.addEventListener('DOMContentLoaded', checkWindowSize)

// for the problem of loading from test section :)
window.onload = function() {  
    const homeSection = document.getElementById('home')
    if (homeSection) {  
        homeSection.scrollIntoView();  
    }  
}
// -------------hide the content of book----------------
const spoilerButton = document.getElementById("spoilerButton")
const spoilerText = document.querySelector(".spoil")

spoilerButton.addEventListener("click", function() {
    if (spoilerText.style.display === "none") {
      spoilerText.style.display = "block"
      spoilerButton.innerText = "پنهان کردن توضیحات"
    } else {
      spoilerText.style.display = "none"
      spoilerButton.innerText = "برای مشاهده توضیحات کتاب کلیک کنید "
    }
  })
