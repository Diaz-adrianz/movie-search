// =============== element 
const searchBtn = document.getElementById('searchit')
const moviesArea = document.getElementById('movies')
const inputUser = document.getElementById('input-field')
const moreBtn = document.getElementById('expand-more')
const resMsg = document.getElementById('alert')
const loading = document.querySelectorAll('.spinner')


// =========== trigger header 
const header = document.querySelector('header')
window.addEventListener('scroll', function(){ 
    header.classList.toggle('scrolll', window.scrollY)
})

// =========== input listener 
searchBtn.addEventListener('click', async () => {

    moviesArea.innerHTML = '';
    reqValue = inputUser.value.trim()
    page = 1

    loading[1].style.display = 'flex'
    await getMovies(reqValue, page)
})
inputUser.addEventListener('keyup', async e => {

    if ( e.keyCode == 13) {

        moviesArea.innerHTML = '';
        reqValue = inputUser.value.trim()
        page = 1

        loading[1].style.display = 'flex'
        await getMovies(reqValue, page)
    }
})

// ================ current value 
let reqValue;
let page;
let resultLength;

// ============= get movies by current value
async function getMovies (reqValue, page) {
    
    let url = `https://www.omdbapi.com/?s=${reqValue}&page=${page}&apikey=a4a3ad4e`
    
    let movies = await fetching(url)
    if (movies != undefined) {
        
        render(movies.Search)
        
        resultLength = document.querySelectorAll('.movie').length
        if ( resultLength % 10 == 0) {
            moreBtn.classList.remove('disable')
        } else {
            moreBtn.classList.add('disable')
        }

        clickDetail()
    } else {
        return
    }
}
// =================== more button 
moreBtn.addEventListener('click', e => {
    page += 1;
    if ( resultLength % 10 == 0 ) {
        console.log( 'halaman ' + page)

        loading[2].style.display = 'flex';
        getMovies(reqValue, page);
    } else {
        return
    }
})

// ============== render result
function render(movie) {
    let movies = ''
    movie.forEach( m => movies += template(m))
    moviesArea.innerHTML += movies
    return 
}

// ================= fetching url
function fetching(url) {
    return fetch(url)
    .then( res => {

        if ( res.status != 200) {
            alert('Something wrong i can feel it / this page will be reload')
            location.reload()

        } else {
            return res.json()
        }
    })
    .then( data => {
        loading.forEach( m => m.style.display = 'none')

        if ( data.Response == 'False' ) {
            resMsg.classList.add('show-alert')
            resMsg.lastElementChild.textContent = `" ${data.Error} "`

            setTimeout( () => {
                resMsg.classList.remove('show-alert')
            }, 3000)
            return

        } else if ( data.Response == 'True' )  {
            return data
        }
    }) 
}

// ================= get detail
const modalWrap = document.getElementById('modal')
const modalPop = document.getElementById('modal-pop')

function clickDetail(){
  const reqDetail = document.querySelectorAll('.movie')

  reqDetail.forEach( req => {
    req.addEventListener('click', async () => {
        
        let id = req.dataset.idmovie
        let url = `https://www.omdbapi.com/?i=${id}&plot=full&apikey=a4a3ad4e`

        loading[0].style.display = 'flex';
        let detail = await fetching(url)

        let modal = '';
        modal += modalTemplate(detail)

        modalWrap.innerHTML = modal;
        modalPop.classList.add('show')

        document.getElementById('close-modal')
          .addEventListener('click', function(){
            modalPop.classList.remove('show')
          })
      })
    })
  
}

// =============== template
function template(dat) {
    return `<div class="movie" data-idmovie='${dat.imdbID}'>
        <div class="type-ribbon">${dat.Type}</div>
            <img src="${dat.Poster}">
            <div class="title">
            <p>${dat.Title}</p>
            <p>${dat.Year}</p>
        </div>
    </div>`
}
function modalTemplate(mov) {
    return `<button class="material-icons" id="close-modal">close</button>

    <div class="ribbon">
    <p id="a-score">${mov.Metascore}/10</p>  
    <p id="a-type">${mov.Type}</p>  
    </div>

    <img src="${mov.Poster}" alt="">
    
    <section class="info">
    <h2 id="a-jptitle">${mov.Title}</h2>
    <p id="synopsis">
        ${mov.Plot}
    </p>

    <section class="innerinfo">
        <p><span>Genre</span>: ${mov.Genre}</p>
        <p><span>Rated</span>: ${mov.Rated}</p>
        <p><span>Languange</span>: ${mov.Languange == undefined ? '-' : mov.Languange}</p>
        <p><span>Country</span>: ${mov.Country}</p>
    </section>

    <section class="innerinfo">
        <p><span>Released</span>: ${mov.Released}</p>
        <p><span>Runtime</span>: ${mov.Runtime}</p>
    </section>

    <section class="innerinfo">
        <p><span>Writer</span>: ${mov.Writer}</p>
        <p><span>Actors</span>: ${mov.Actors}</p>
        <p><span>Director</span>: ${mov.Director}</p>
        <p><span>BoxOffice</span>: ${mov.BoxOffice}</p>
        <p><span>Production</span>: ${mov.Production}</p>
        <p><span>Awards</span>: ${mov.Awards}</p>
    </section>

    <section class="innerinfo">
        <p><span>Website</span>: <a href="${mov.Website == undefined || 'N/A' ? '#' : mov.Website}">${mov.Website}</a></p>
    </section>
    <section class="innerinfo">
        ${mov.Ratings.map( r => {
            return `<div class="ratings">
                <p>${r.Source}</p>
                <span>${r.Value}</span>
            </div>`
        }).join('')}
        
    </section>
</section>`
}
