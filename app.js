document.addEventListener("DOMContentLoaded",function(){
    const searchButton = document.getElementById("search-btn");
    const userNameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-card");


    function validateUserName(userName){
        if(userName.trim() === ""){
            alert("User Name should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(userName);
        if(!isMatching){
            alert("invalid userName");
        }
        return isMatching;  
    }


    function updateCircle(solved ,total , label , circle){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree",`${progressDegree}%`);
        label.textContent =`${solved}/${total}`;
        circle.classList.remove('hidden');
    }

    


    function showUserData(data){
        const totalQues= data.totalQuestions;
        const totalEasyQues= data.totalEasy;
        const totalMediumQues= data.totalMedium;
        const totalHardQues= data.totalHard;

        const SolvedQues= data.totalSolved;
        const solvedEasyQues= data.easySolved;
        const solvedMediumQues= data.mediumSolved;
        const solvedHardQues= data.hardSolved;

        updateCircle(solvedEasyQues ,totalEasyQues , easyLabel , easyProgressCircle);
        updateCircle(solvedMediumQues ,totalMediumQues , mediumLabel , mediumProgressCircle);
        updateCircle(solvedHardQues ,totalHardQues , hardLabel , hardProgressCircle);
        

        const cardData =[
        {label: "Total Question" , value:data.totalQuestions},
        {label: "Total Solved" , value:data.totalSolved},
        {label: "Acceptance Rate %" , value:data.acceptanceRate},
        {label: "Ranking" , value:data.ranking},
        {label: "Contribution Points" , value:data.contributionPoints}

        ]


        cardStatsContainer.innerHTML=cardData.map(
            data =>{
                return `<div class="card"> 
                <h3> ${data.label} </h3>
                <p>  ${data.value} </p>
                </div>`
            }
        )
    }



    async function fetchUserDetail(userName) {
        const url = `https://leetcode-stats-api.herokuapp.com/${userName}`;
        try{
            searchButton.textContent="Searching....";
            searchButton.disabled =true;
            const response = await fetch(url);
            if(!response.ok){
                throw new Error("unable to fetch user detail");
            }
            let data = await response.json()
            console .log(data);
            showUserData(data);
        }
        catch(error){
           statsContainer.innerHTML = `<p>${error.message}</p>`;
           easyProgressCircle.classList.add('hidden');
           mediumProgressCircle.classList.add('hidden');
           hardProgressCircle.classList.add('hidden');
        }
        finally{
            searchButton.textContent="Search";
            searchButton.disabled =false;
        }
    }



    searchButton.addEventListener('click',function(){
        const userName = userNameInput.value ;
        console.log(userName);
        if(validateUserName(userName)){
            fetchUserDetail(userName);
        }
    })

    easyLabel.textContent = "";
    mediumLabel.textContent = "";
    hardLabel.textContent = "";

})