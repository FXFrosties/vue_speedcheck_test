var api = 'https://api.init7.net/';

var app = new Vue({
    el: '#app',
    data: {
        plz: '',
        strasse: '',
        house_nr: '',
        plz_valid: false,
        strasse_valid: false,
        info: '',
        plz_orte: [],
        strassen: [],
        ort: ''
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
                    console.log
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
        select_plz: function (event) {
            this.plz_valid = true
            splitArray = event.target.innerText.split(" ")
            this.plz = splitArray[0]
            splitArray.shift()
            this.ort = splitArray.join()
        },
        select_street: function(event){
            this.strasse_valid = true
            this.strasse = event.target.innerText
        }
}
})
