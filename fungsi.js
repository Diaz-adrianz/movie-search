const searchBtn = document.getElementById('searchit')
const moviesField = document.getElementById('movies')
const input = document.getElementById('input-field')
const next = document.getElementById('expand-more')
const alertBox = document.getElementById('alert')


// trigger header 
const header = document.querySelector('header')
window.addEventListener('scroll', function(){ 
    header.classList.toggle('scrolll', window.scrollY)
})

// =========== input listener 
searchBtn.addEventListener('click', getMovies)
input.addEventListener('keyup', e => {
    if ( e.keyCode == 13) {
        getMovies()
    }
})

document.getElementById('banner').onclick = () => {
    location.reload()
}

// ============= get movies by input
async function getMovies () {
    moviesField.innerHTML = '';

    let reqVal = input.value.trim()
    
    let page = 1
    
    let movie = await fetching(`https://www.omdbapi.com/?s=${reqVal}&page=${page}&apikey=a4a3ad4e`)
    
    if (movie != undefined) {
        render(movie.Search)
    
        let movies = document.querySelectorAll('.movie')
        more(reqVal, movies, page)
        
        clickDetail()
        input.value = ''
    } else {
        return
    }
}

// ============= more / pagination
function more(reqVal, movies, page) {
    if (movies.length >= 10) {
        next.classList.remove('disable')
        next.addEventListener('click', async () => {
            page++
            let expand = await fetching(`https://www.omdbapi.com/?s=${reqVal}&page=${page}&apikey=a4a3ad4e`)
            render(expand.Search);
            clickDetail()
        })
    } else {
        next.classList.add('disable')
        return
    }

}

// ============== render result
function render(movie) {
    let movies = ''
    movie.forEach( m => movies += template(m))
    moviesField.innerHTML += movies
    return 
}

// ================= fetching url
function fetching(url) {
    return fetch(url)
    .then( res => {
        console.log(res.status)
        if ( res.status != 200) {
            alert('Something wrong i can feel it / this page will be reload')
            location.reload()
            return
        } else {
            return res.json()

        }
    })
    .then( data => {
        console.log(data)
        if ( data.Response == 'False' ) {
            alertBox.classList.add('show-alert')
            alertBox.lastElementChild.textContent = `" ${data.Error} "`
            setTimeout( () => {
                alertBox.classList.remove('show-alert')
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
        let reqUrl = `https://www.omdbapi.com/?i=${id}&plot=full&apikey=a4a3ad4e`

        let detail = await fetching(reqUrl)

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
        <p><span>Website</span>: <a href="#">${mov.Website}</a></p>
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
