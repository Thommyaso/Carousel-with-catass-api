document.addEventListener('DOMContentLoaded', () => {
    const btnLeft = document.querySelector('#btnLeft')
    const btnRight = document.querySelector('#btnRight')
    const box = document.querySelector('.slides')
    const nodes = document.querySelectorAll(".box")
    const carouselDiv = Array.from(nodes)
    
    const referBtns = document.querySelectorAll('.btnRefer')
    const indicator = document.querySelector('.dots')
    const INTERVAL_TIME = 4000
    const allDots = []
    
    let counter = 1
    let size = document.querySelector('html').clientWidth + getBrwoserScrollbarWidth()

    box.style.transition ='transform 0.4s ease in'
    box.style.transform = `translateX(${(-size * counter)}px)` //determines which slide is shown (starts form the slide nr1)

    const cloneAll = (index) => {       //clonning first and last div and placing them in html to create smooth transition 
        if(index === carouselDiv.length - 1){
            const cloneFirst = nodes[0].cloneNode(true)
            const cloneLast = nodes[nodes.length - 1].cloneNode(true)
            carouselDiv[carouselDiv.length - 1].after(cloneFirst)
            carouselDiv[0].before(cloneLast)
        }
    }

// Fetch version:
    /* const getCats = async () => {       //getting image url from the api
        try{
          const jsonData = await fetch('https://cataas.com/cat?json=true')
          const data = await jsonData.json() 
          return data.url
        }
        catch(e){
          console.log('PROBLEM!!', e)
        }
    } */

// Axios version:
    const getCats = async () => {       //getting image url from the api
        try{
          const jsonData = await axios.get('https://cataas.com/cat?json=true')
          return jsonData.data.url
        }
        catch(e){
          console.log('PROBLEM!!', e)
        }
    }
      
    carouselDiv.forEach( (element, index) => {

        const setPhoto = async () => {      // setting a random image to each carusel div
                const photoAdress = await getCats()
                element.style.backgroundImage = `url('https://cataas.com${photoAdress}')`
                cloneAll(index) 
        } // DLACZEGO TA FUNKCJA NIE DZIAŁA GDY WYCIĄGAM JĄ POZA PĘTLĘ .forEach I PRÓBUJĘ JĄ TYLKO PRZYWOŁAĆ W PĘTLI??

        setPhoto()
        element.style.width = `100vw`                          // sets width for all slides
        const dot = document.createElement('div')
        //create navigation dot
        dot.classList.add(`dot`)
        indicator.append(dot)                                  //creates same number of dots as number of slides (ignoring clones)
        allDots.push(dot)
    })

    allDots[0].classList.add('activeDot')
    
    function activateDot(counter){                          //when slide changes, updates wchich dot should be activated, rest gets disactivated
        for(dot of allDots){
            dot.classList.remove('activeDot')
        }

        switch(counter){
            case(0): 
            case(carouselDiv.length + 2):
                allDots[allDots.length-1].classList.add('activeDot')
                break
            case(counter === 1):
            case(carouselDiv.length + 1):
                allDots[0].classList.add('activeDot')
                break
            default:
                console.log()
                allDots[counter-1].classList.add('activeDot')
        }
    }

    allDots.forEach((element, index)=>{
        element.addEventListener('click', ()=>{
            counter = index
            addAnimation(false)

        })
    })

    function getBrwoserScrollbarWidth(){       //gets a width of browsers scroll-bar( it needs to be used when determinating slide window-size)
        return window.innerWidth - document.documentElement.clientWidth;
    }

    const runTime = (rev) => {                        //creates interval         
        interval = setInterval(()=> addAnimation(rev), INTERVAL_TIME)
    }

    const addAnimation = (rev) =>{             //creates animation and updates wchich slide should be shown, also determins wchich dot is shown
        box.classList.add('slideAnimation')
        if(rev){
            counter --   
            activateDot(counter)
            box.style.transform = `translateX(${(-size * counter)}px)`
        }else{
            counter ++
            activateDot(counter)
            box.style.transform = `translateX(${(-size * counter)}px)`
        }    
    }

    const run = (condition, rev)=>{
        clearInterval(interval)
        if(condition){
            return
        }else{
            addAnimation(rev)
            runTime()
        }
    }

    btnLeft.addEventListener('click', () => (run(counter <= 0, true)))
    btnRight.addEventListener('click', () => (run(counter > carouselDiv.length, false)))

    box.addEventListener('transitionend', () => {       //when end of the slides is reached resets the position to first or last clone, depending on direction of animation
        if(counter === 0){
            box.classList.remove('slideAnimation')
            counter = nodes.length
            box.style.transform = `translateX(${(-size * counter)}px)`
        }else if(counter === carouselDiv.length+1){
            box.classList.remove('slideAnimation')
            counter = 1
            box.style.transform = `translateX(${(-size * counter)}px)`
        }
    })

    window.addEventListener('resize', () => {                 // keeps slides 100vw when resizing browsers window
        clearInterval(interval)
        box.classList.remove('slideAnimation') 
        size = document.querySelector('html').clientWidth + getBrwoserScrollbarWidth()
        box.style.transform = `translateX(${(-size * counter)}px)`
        runTime(0)
    })

    referBtns.forEach((element, index) => {
        element.addEventListener('click', () => {              // when button is pressed activates 3 slide
            clearInterval(interval)
            box.classList.add('slideAnimation')
            counter = index + 1
            activateDot(counter)
            box.style.transform = `translateX(${(-size * counter)}px)`
            runTime(0)
        })
    })

    carouselDiv.forEach((element) => {
        element.addEventListener('mouseover', ()=>{
            clearInterval(interval)
        })
        element.addEventListener('mouseout', ()=>{
            runTime(false)
        })

    })

    runTime(false)
})