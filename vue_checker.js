var api = 'https://api.init7.net/';

var app = new Vue({
    el: '#app',
    data: {
        plz: '',
        strasse: '',
        house_nr: '',
        plz_valid: false,
        strasse_valid: false,
        house_nr_valid: false,
        plz_orte: [],
        strassen: [],
        house_nrs: [],
        ort: '',
        result: '',
        loading: ''
    },

    watch: {
        plz: function () {
            if(this.plz.length > 4){
                this.ort = "Bitte geben Sie ein gültige PLZ ein"
            }
            else if (this.plz.length > 3){
                this.getPlzCity()
            }else if (this.plz.length > 1) {
                this.plz_valid = false
                this.ort = ''
                this.getPlzCity()
            }
        },
        strasse: function(){
            if(this.strasse.length > 2 && this.plz.length == 4 && this.plz_orte.length > 0){

                //prüft ob es resultate zum anzeigen gibt
                if(this.strassen.length>0){
                    //prüft ob die eingegebene Strasse im Resultarray vorkommt
                    var found = false
                    for(var i = 0; i < this.strassen.length; i++) {
                        if (this.strassen[i].street == this.strasse) {
                            var found = true
                            break;
                        }
                    }
                    if(!found){
                        this.strasse_valid = false;
                    }
                }
                this.getStrasse()
            }
        },
        house_nr: function(){
            console.log("hello")
            if(this.strassen.length > 0 && this.plz_orte.length > 0 && this.house_nr.length > 0){
                if(this.house_nrs.length > 0){
                    for(var i = 0; i < this.house_nrs.length; i++) {
                        if (this.house_nrs[i].house == this.house_nr) {
                            var found = true
                            break;
                        }
                    }
                    if(!found){
                        this.house_nr_valid = false;
                    }
                }
                
                this.getHouseNr()
            }
            
        }
    },

    methods: {
        getPlzCity: function () {
            var vm = this
            axios.get(api + 'post/zip/' + this.plz + '/')
                .then(function (response) {
                    vm.plz_orte = response.data
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        getStrasse: function () {
            var vm = this
            axios.get(api + 'post/streets/' + this.plz + '/' + this.strasse)
                .then(function (response) {
                    vm.strassen = response.data
                    //console.log(vm.strassen.__ob__.value[0].street)
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        getHouseNr: function(){
            var vm = this
            axios.get(api + 'post/houses/' + this.plz + '/' + this.strasse + '/' + this.house_nr)
                .then(function (response) {
                    vm.house_nrs = response.data
                    console.log(vm.house_nrs)
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        select_plz: function (event) {
            this.plz_valid = true
            var splitArray = event.target.innerText.split(" ")
            this.plz = splitArray[0]
            splitArray.shift()
            this.ort = splitArray.join()
        },
        select_street: function(event){
            this.strasse_valid = true
            this.strasse = event.target.innerText
        },
        select_house_nr: function(event){
            this.house_nr_valid = true
            this.house_nr = event.target.innerText
        },
        check: function(){
            this.loading = 'loading'
            var vm = this
            console.log(api + 'check/address/' + this.plz + '/' + this.strasse + '/' + this.house_nr + '/')
            axios.get(api + 'check/address/' + this.plz + '/' + this.strasse + '/' + this.house_nr + '/')
                .then(function (response) {
                    console.log(response.data)
                    vm.result = response.data
                    vm.loading = ''
                })
                .catch(function (error) {
                    console.log(error)
                    vm.loading = 'fehler beim laden'
                })
        }
    },
    computed: {
        info: function(){
            return("plz_valid: " + this.plz_valid + "<br>" +
                  "strasse_valid: " + this.strasse_valid + "<br>" +
                  "house_nr_valid: " + this.house_nr_valid + "<br>" +
                  "plz: " + this.plz + "<br>" +
                  "ort: " + this.ort + "<br>" +
                  "strasse: " + this.strasse + "<br>" +
                  "house_nr: " + this.house_nr + "<br>" +
                  "plz_orte: " + this.plz_orte + "<br>" +
                  "strassen: " + this.strassen + "<br>" +
                  "house_nrs: " + this.house_nrs + "<br>"+
                  "result_is_fiber: " + this.result.fiber + "<br>" + 
                  "result_is_vdsl: " + this.result.vdsl + "<br>" + 
                  "result_is_litexchange: " + this.result.litex + "<br>" + 
                  "result_is_vdsl_speed_up: " + this.result.vdsl_up + "<br>" + 
                  "result_is_vdsl_speed_down: " + this.result.vdsl_down + "<br>"
                  )
        }
    }
})
