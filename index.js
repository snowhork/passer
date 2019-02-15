Vue.use(VueMaterial.default)

const strSet = "abcdefghjklmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789!@#$%^&"

const generateHash = (message) => {
  var shaObj = new jsSHA("SHA-256", "TEXT")
  shaObj.update(message)
  return shaObj.getHash("HEX")
}

const hashToStr = (hash) => {
  let result = ""
  for(let i = 0; i < 64; i +=4 ) {
    const str = hash.substr(i, 4)
    result += strSet[parseInt(str, 16)%64]
  }
  return result
}

var app = new Vue({
  el: '#app',
  data: function () {
    return {
      message: 'Passer',
      newPrefix: "",
      prefix: "",
      password: "",
      options: [
        "example",
      ],
      currentHash: "",
      showSnackbar: false,
    }
  },
  methods: {
    createPrefix: function () {
      if(this.newPrefix == "") return
      if(this.options.includes(this.newPrefix)) return
      this.options.push(this.newPrefix)
      this.prefix = this.newPrefix
      this.newPrefix = ""

      let hash = generateHash(this.prefix)
      let result = hashToStr(hash)
    },

    deletePrefix: function () {
      if(this.prefix == "") return
      this.options = this.options.filter(p => p != this.prefix)
      this.prefix = ""

    },
  },

  watch: {
    prefix: function(newPrefix) {
      localStorage.setItem("prefix", JSON.stringify(newPrefix));
      if(newPrefix == "" || this.password == "") {
        this.currentHash = ""
        return
      }
      const hash = generateHash(newPrefix+this.password)
      this.currentHash = hashToStr(hash)
    },

    password: function(newPassword) {
      if(!this.prefix || this.prefix == "") {
        this.currentHash = ""
        return
      }
      const hash = generateHash(this.prefix+newPassword)
      this.currentHash = hashToStr(hash)
    },

    options: function(newOption) {
      localStorage.setItem("options", JSON.stringify(newOption));
    },
  },

  mounted : function() {
    this.clipBoard = new ClipboardJS('.clipcopy')
    this.clipBoard.on('success', function(e) {
      e.clearSelection();
    });
    this.clipBoard.on('error', function(e) {
      alert( 'コピー失敗' )
      console.error('Action:', e.action)
      console.error('Trigger:', e.trigger)
    });

    this.options = JSON.parse(localStorage.getItem("options"))
    if(!this.options) {
      this.options = ["example"]
    }

    this.prefix = JSON.parse(localStorage.getItem("prefix"))
    if(!this.prefix) {
      this.prefix = ""
    }
  },
})
