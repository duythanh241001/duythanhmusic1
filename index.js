const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const app = { //render là phương thức, songs, app là 1 đối tượng
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRandom: false,
    songs: [
      {
        name: "Sao Cũng Được",
        singer: "Binz",
        path: "./Music/SaoCungDuocGuitarVersion-Binz-5411337.mp3",
        image: "https://vcdn-giaitri.vnecdn.net/2020/09/16/Binz-2599-1600230128.jpg"
      },
      {
        name: "Mang Tiền Về Cho Mẹ",
        singer: "Đen Vâu",
        path: "./Music/Mang Tien Ve Cho Me - Den_ Nguyen Thao.mp3",
        image:"https://vcdn-giaitri.vnecdn.net/2019/11/07/rapper-Den-5510-1573122371.jpg"
      },
      {
        name: "Hãy Trao Cho Anh",
        singer: "Sơn Tùng-MTP",
        path:"./Music/HayTraoChoAnh-SonTungMTPSnoopDogg-6010660.mp3",
        image:"https://2sao.vietnamnetjsc.vn/images/2021/10/04/18/18/st2.jpg"
      },
      {
        name: "Cô Dâu",
        singer: "Hòa Minzy",
        path: "./Music/CoDau-HoaMinzy-2607941.mp3",
        image:"https://static2.yan.vn/YanNews/2167221/202001/loat-anh-dep-me-man-cua-hoa-minzy-mac-loi-don-sinh-con-2f9638cc.jpg"
      },
      {
        name: "Ngày Đầu Tiên",
        singer: "Đức Phúc",
        path: "./Music/NgayDauTien-DucPhuc-7129810.mp3",
        image:"https://streaming1.danviet.vn/upload/2-2020/images/2020-04-16/85260190_2904365252958459_4706172833628160000_n-1587006892-width960height957.jpg"
      },
      {
        name: "Níu Duyên",
        singer: "Lê Bảo Bình",
        path:"./Music/NiuDuyen-LeBaoBinh-6872127.mp3",
        image:"https://vnn-imgs-f.vgcloud.vn/2020/04/25/15/le-bao-binh-moi-thu-toi-co-duoc-deu-nho-may-man-1.jpg"
      },
      {
        name: "Thế Thái",
        singer: "Hương Ly",
        path: "./Music/TheThai-HuongLy-6728509.mp3",
        image:"https://static2.yan.vn/YanNews/2167221/202003/huong-ly-ky-niem-1-nam-ca-hat-sau-nhieu-lum-xum-414cece8.jpg"
      },


    ],
    render: function() {
      const htmls = this.songs.map((song, index) => { // song là 1 tham số tự đặt // this thuộc về 1 oject
        return `
          <div class="song ${index === this.currentIndex ? 'active': ''}" data-index="${index}">
            <div class="thumb" 
              style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
        `
      });

      playlist.innerHTML = htmls.join('');
    },

    defineProperties: function() {
      Object.defineProperty(this, "currentSong", { // ?????? currentSong là bài hát htai
        get: function() { // get ở đây là key
          return this.songs[this.currentIndex]; // lấy ra bài hát đầu tiên trong obj
        }
      })
    },
    handleEvents: function() {
      const _this = this // lưu tk this ở bên ngoài handleEvents vào _this
      const cdWidth = cd.offsetWidth;

      // Xử lý CD quay và dừng
      const cdThumbAnimate = cdThumb.animate([
        { transform: 'rotate(360deg)'}
      ], {
        duration: 10000, // 10 seconds
        iterations: Infinity
      })
      cdThumbAnimate.pause()

      // Xử lý phóng to, thu nhỏ CD
      document.onscroll = function() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop;

        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
        cd.style.opacity = newCdWidth / cdWidth;
      }

      // Xử lý khi click Play
      playBtn.onclick = function() {
        if (_this.isPlaying) {
          audio.pause()  
        }
        else {
          audio.play() 
        } 
      }

      // Khi song được play
      audio.onplay = function() {
        _this.isPlaying = true
        player.classList.add('playing')
        cdThumbAnimate.play()
      }

      // Khi song bị pause
      audio.onpause = function() {
        _this.isPlaying = false
        player.classList.remove('playing')
        cdThumbAnimate.pause()
      }

      // Khi tiến độ bài hát thay đổi

      // currentTime trả ra số giây mà cái nút play đg ở => tính ra % ??
      // duration tổng thời lượng của bài hát
      audio.ontimeupdate = function() { 
        if(audio.duration) {
          // Số giây đó tương ứng với bao nhiêu %
          const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
          progress.value = progressPercent

        }
      }
      // Xử lý khi tua songs
      progress.oninput = function(e) {
        audio.pause();
        setTimeout(function() {
          audio.play()
        }, 500);
        const seekTime = audio.duration / 100 * e.target.value //e.target.value là số %
        audio.currentTime = seekTime
      }
      // Khi next song
      nextBtn.onclick = function() {
        if(_this.isRandom) {
          _this.playRandomSong()
        }
        else {
          _this.nextSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
      }
      // Khi prev song
      prevBtn.onclick = function() {
        if (_this.isRandom) {
          _this.playRandomSong()
        }
        else {
          _this.prevSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
      }

      // Xử lý bật/tắt random song
      randomBtn.onclick = function() {
        _this.isRandom = !_this.isRandom
        randomBtn.classList.toggle('active', _this.isRandom) // nếu _this.isRandom là true thì add <=>
      }
      // Xử lý lặp lại song
      repeatBtn.onclick = function() {
        _this.isRepeat = !_this.isRepeat
        repeatBtn.classList.toggle('active', _this.isRepeat)
      }
      // Xử lý tự động next bài khi kết thúc bài hát
      audio.onended = function() { // onended sự kiện có sẵn khi bài hát kết thúc
        if (_this.isRepeat) {
          audio.play() 
        }
        else {
          nextBtn.click() // click() --> tự next (thay mình bấm) 
        }
      }
      // Lắng nghe click vào playlist
      playlist.onclick = function(e) {
        //closest trả về element 1 là chính nó 2 thẻ cha của nó 

        const songNote = e.target.closest('.song:not(.active)')
        if (songNote || e.target.closest('.option')) {
          // Xử lý khi click vào song
          if (songNote) {
            //Cách 1: console.log(songNote.getAttribute('data-index')) 
            _this.currentIndex = Number(songNote.dataset.index)
            _this.loadCurrentSong()
            _this.render()
            audio.play() 

          }
          // Xử lý khi click vào song option
          if (e.target.closest('.option')) {

          }
        }
      }
    },
    // Hàm khi bài hát đg phát đc hiện lên đầu
    scrollToActiveSong: function() {
      setTimeout(function() {
        $('.song.active').scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      },300)
    },

    // Hàm load bài ra
    loadCurrentSong: function() { 
      heading.textContent = this.currentSong.name
      cdThumb.style.background = `url('${this.currentSong.image}')`
      audio.src = this.currentSong.path
    },

    // Hàm next bài hát
    nextSong: function() {
      this.currentIndex++
      if (this.currentIndex >= this.songs.length) {
        this.currentIndex = 0
      }
      this.loadCurrentSong()
    },
    // Hàm lùi bài hát
    prevSong: function() {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1
      }
      this.loadCurrentSong()
    },

    // Hàm random bài hát
    playRandomSong: function() {
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * this.songs.length)
      }
      while (newIndex === this.currentIndex)
      this.currentIndex = newIndex
      this.loadCurrentSong()
    },
    start: function() {
      // Định nghĩa các thuộc thích cho object
      this.defineProperties() // this là app

      // Lắng nghe/ xử lý các sự kiện (Dom event)
      this.handleEvents()

      //Tải thông tin bài hát đầu tiền vào UI khi chạy ứng dụng
      this.loadCurrentSong()

      //Render playlist
      this.render()
    }  
} 
app.start()   