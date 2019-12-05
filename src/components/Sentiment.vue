<template>
  <div class="container-fluid pt-5 mt-5" id="sentiment">
    <h3><b>Hasil Web Scraper</b></h3>
    <p> Berikut ditampilkan hasil yang telah diperoleh dari proses web scraping.
        Data yang ditampilkan merupakan data mentah yang belum dianalisis.<br>
        Konten tabel berikut diambil dari basis data Firestore dan di-generate dari hasil scraping yang berbasis Node.js.<br>
    </p>
    
    <button class="btn btn-primary float-left mt-3 mb-3" @click="analyseSentiment" >
      Analisis Sentimen
    </button>
    
    <div class="container-fluid">    
      <!--Datatables.net-->  
      <table id="tabel-sumber" class="display" style="width:100%">
        <!--Generated from firestore--> 
      </table>
    </div>      
  </div>  
</template>

<script>
import db from './firebaseInit'
import firebase from 'firebase'
import { functions } from 'firebase'
import sentiment from 'multilang-sentiment'
var Regex = require("regex")
var buttons = require( 'datatables.net-buttons' )( window, $ );

export default {
  name: 'Coba',
  components: {
  },
  data () {
    return {
      counts :[],
      sentiments : [],
      data : this.sentiments = [],
      columns: [],
    }
  },
   
  created () {
    db.collection('skripsi').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const a = doc.data().hasilScraping
        a.forEach((item, index) => {
          const data = {
            'id' : doc.id,
            'alamat_domain' : doc.data().alamatDomain,
            'judul_artikel' : item.judulArtikel,
            'konten_artikel' : item.kontenArtikel, 
            'tanggal_artikel' : item.tanggalArtikel,
          }
          this.sentiments.push(data)
        })
      })
    }).then(() => {
      this.createTable()          
    })
    this.data = this.sentiments   
  },
  
  methods: {
    createTable() {
      const data = this.sentiments.map(s => {
        return [
          s.id, s.alamat_domain , s.judul_artikel, s.tanggal_artikel, s.konten_artikel, 
        ]
      })
      //Load Datatables.net
      $('#tabel-sumber').ready(() => {
        $('#tabel-sumber').DataTable(
          {
            data,
            columns : [
              { title : "ID"},
              { title : "Alamat Domain"},
              { title : "Judul Artikel"},
              { title : "Tanggal Post"},
              { title : "Konten Artikel"},
            ],
            dom: 'Bfrtip',
            buttons: [
              'copy', 'csv', 'excel', 'pdf', 'print'
            ],
            initComplete: function () {
            var btns = $('.dt-button');
            btns.addClass('btn btn-primary btn-sm');
            btns.removeClass('dt-button');
            }
          }
        );
      });
    },
      
    //Method for analyse sentiment (Multilang-Sentiment)
    analyseSentiment() { 
      this.sentiments.forEach((data,index) => { 
        let label = 'unset'
        const stringsentimen = this.sentiments[index].konten_artikel
        const sentimentResult = sentiment(stringsentimen, 'id')
        const score = sentimentResult.score
        //Give label to each score
          if (score > 5) {
            label = "positif"
          }
          else if (score > -5) {
            label = "netral"
          }
          else {
            label = "negatif"
          }
        //define hasil_post, label_post, kategori_post
        this.sentiments[index].hasil_post = sentimentResult
        this.sentiments[index].hasil_post.label_post = label
        this.sentiments[index].hasil_post.kategori_post = this.extractWord(this.sentiments[index].judul_artikel)
      })
      
      db.collection('skripsi').get().then(querySnapshot => { 
        querySnapshot.forEach(doc => {
          let localHasilPost = this.sentiments.filter( s => s.id == doc.id).map(post => post.hasil_post)
          var docRef = db.collection('skripsi').doc(doc.id)
          console.log(localHasilPost)
          db.collection('skripsi').doc(doc.id).update({hasilPost: localHasilPost})
        })
        })
      .then(res => console.log(res)) 
      .catch(error => console.log(error)) 
    },

    //Method for Extracting Word (REGEX)
    extractWord(string) {
        //regex under category 'UGM'
        const regex = /UGM|ugm|Universitas Gadjah Mada/
        const isExisting = regex.test(string)
        //regex under category 'Prestasi'
        const regexPrestasi = /prestasi|berhasil|bangga|kebanggaan|penemuan|raih|meraih|penghargaan|menang|memenangkan/
        const isExistingPrestasi = regexPrestasi.test(string)
        const regexCyber = /(?=.*Cyber)(?=.*Campus)|(?=.*CYBER)(?=.*CAMPUS)|Cybercampus/
        const isExistingCyber = regexCyber.test(string)

        //etc (customisable)
        const regexKejahatan = /kasus|pelaku|tersangka|jahat|barang bukti|alibi|bersalah|penjara|korban|ditangkap/
        const isExistingKejahatan = regexKejahatan.test(string)
        const regexPengalaman = /Pengalaman|sharing|cerita/
        const isExistingPengalaman = regexPengalaman.test(string)
        const regexOpini = /Mahasiswa|Program|Pemerintah|Pasal|Undang-undang/
        const isExistingOpini = regexOpini.test(string)
        const regexTeknologi = /Kinect|Domain|IT|Internet|Data|Hoax|Fitur|User|online|Website/
        const isExistingTeknologi = regexTeknologi.test(string)
        const regexHelloworld = /(?=.*Hello)(?=.*world)|(?=.*Hello)(?=.*World)/
        const isExistingHelloworld = regexHelloworld.test(string)

        //categories   
        let category = "unset"
        if (isExisting == true) {
          category = "UGM"
        } else if (isExistingPrestasi == true) {
          category = "Prestasi"
        } else if (isExistingCyber == true) {
          category = "Cyber Campus"
        }


        else if (isExistingKejahatan == true) {
          category = "Kasus"
        } else if (isExistingPengalaman == true) {
          category = "Pengalaman"
        } else if (isExistingOpini == true) {
          category = "Opini" 
        } else if (isExistingTeknologi == true) {
          category = "Teknologi" 
        }else if (isExistingHelloworld == true) {
          category = "Hello World"
        }
          else {
          category = "Lain"
        }
        return category
    },
  },
}
</script>

<style>
/* Sentiment CSS */
#sentiment .items-per-page {
  height: 100%;
  display: flex;
  align-items: center;
  color: #337ab7;
}

#sentiment .items-per-page label {
  margin: 0 15px;
}
#tabel-sumber th, td {
  vertical-align: top;
}
/* ITEMS PER PAGE DROPDOWN CSS */
.item-per-page-dropdown {
  background-color: transparent;
  min-height: 30px;
  border: 1px solid #337ab7;
  border-radius: 5px;
  color: #337ab7;
}
.item-per-page-dropdown:hover {
  cursor: pointer;
}
</style>


