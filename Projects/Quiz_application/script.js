// Quize Questions:

    const quizData = [
      {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Lisbon"],
        correct: 2
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        correct: 1
      },
      {
        question: "What does DOM stand for?",
        options: [
          "Document Object Model",
          "Data Object Method",
          "Digital Output Monitor",
          "Desktop Orientation Model"
        ],
        correct: 0
      }
    ];

    // HTML elements using DOM(Document object Modal):

document.body.style.backgroundColor = "rgba(106, 230, 209, 0.71)";

      const container = document.createElement("div"); 
container.style.maxWidth = "600px";
container.style.margin = "50px auto";
container.style.padding = "30px";
container.style.borderRadius = "10px";
container.style.boxShadow = "50px 40px 10px rgba(0, 0, 0, 0.51)";
container.style.fontFamily = "Times New Roman, serif";
container.style.fontWeight = "bold";

container.style.transform = "translateX(100%)"; 
container.style.opacity = "0"; 

container.style.transition = "transform 1.5s ease-out, opacity 1.5s ease-out";
container.style.background = "linear-gradient(135deg, #44a6e7ff, #e1e1ecff)";

setTimeout(() => {
  container.style.transform = "translateX(0)";
  container.style.opacity = "1";
}, 100);
    

    const questionEl = document.createElement("h2");
    const optionsContainer = document.createElement("div");
    const warning = document.createElement("p");
    warning.style.color = "red";
    warning.style.fontSize = "14px";

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.style.marginTop = "20px";
    nextBtn.style.padding = "10px 20px";
    nextBtn.style.backgroundColor = "#e9c654ff";
    nextBtn.style.color = "black";
    nextBtn.style.fontWeight = "bold";
    nextBtn.style.border = "none";
    nextBtn.style.borderRadius = "5px";
    nextBtn.style.cursor = "pointer";

    container.appendChild(questionEl);
    container.appendChild(optionsContainer);
    container.appendChild(warning);
    container.appendChild(nextBtn);
    document.body.appendChild(container);

    // Add footer
    const footer = document.createElement("footer");
    footer.textContent = "By Arun Sajwan | © 2025 Quiz App. All rights reserved";
    
    footer.style.color = "rgba(56, 53, 53, 0.99)";
    footer.style.textAlign = "center";
    footer.style.padding = "15px";
    footer.style.position = "fixed";
    footer.style.left = "0";
    footer.style.right = "0";
    footer.style.bottom = "0";
    footer.style.fontFamily = "Times New Roman, serif";
    footer.style.fontWeight = "bold";
    document.body.appendChild(footer);

  //  Quiz logic:

    let currentQuestion = 0;
    let score = 0;

    function loadQuestion() {
      // Clear previous
      optionsContainer.innerHTML = '';
      warning.textContent = '';

      const qData = quizData[currentQuestion];
      questionEl.textContent = `Q${currentQuestion + 1}. ${qData.question}`;

      qData.options.forEach((option, idx) => {
        const label = document.createElement("label");
        label.style.display = "block";
        label.style.margin = "10px 0";
        label.style.cursor = "pointer";

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "answer";
        input.value = idx;
        input.style.marginRight = "10px";

        label.appendChild(input);
        label.appendChild(document.createTextNode(option));
        optionsContainer.appendChild(label);
      });
    }

    function getSelectedAnswer() {
      const radios = document.getElementsByName("answer");
      for (let radio of radios) {
        if (radio.checked) {
          return parseInt(radio.value);
        }
      }
      return null;
    }

    nextBtn.addEventListener("click", () => {
      const selected = getSelectedAnswer();
      if (selected === null) {
        warning.textContent = "⚠️ Please select an answer before continuing.";
        return;
      }

      if (selected === quizData[currentQuestion].correct) {
        score++;
      }

      currentQuestion++;

      if (currentQuestion < quizData.length) {
        loadQuestion();
      } else {
        showFinalScore();
      }
    });

    function showFinalScore() {
      container.innerHTML = `
        <h2>Your Score</h2>
        <p>You got <strong>${score}</strong> out of <strong>${quizData.length}</strong> questions right.</p>
        <button id="restartBtn">Restart Quiz</button>
      `;

      const restartBtn = container.querySelector("#restartBtn");
      restartBtn.style.padding = "10px 20px";
      restartBtn.style.backgroundColor = "#28a745";
      restartBtn.style.color = "white";
      restartBtn.style.border = "none";
      restartBtn.style.borderRadius = "5px";
      restartBtn.style.cursor = "pointer";

      restartBtn.addEventListener("click", () => {
        location.reload();
      });
    }

    //  Initial calling:
    
    loadQuestion();
