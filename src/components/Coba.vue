<template>
  <div class="container-fluid pt-5 mt-5" id="sentiment">
    <h3><b>Hasil Analisis Sentimen</b></h3>
    <p> Berikut ditampilkan hasil yang telah diperoleh dari proses analisis sentimen.<br>
        Hasil berikut diambil dari perhitungan sentimen dari setiap post artikel, yang kemudian dihitung skor sentimennya
        menggunakan library Multilang-Sentimen JavaScript.</p>
    <!-- <button class="btn btn-success ml-auto mt-3 mb-5" @click="analyseSentiment" >Analisa Sentimen</button> -->
    <div class="container-fluid my-3">    
      <!--Datatables.net-->  
      <table id="tabel-hasil" class="display" style="width:100%">
        <!--Generated from firestore--> 
      </table>
    </div>      
  </div>  
</template>


<script>
import db from './firebaseInit'
import firebase from 'firebase'
import { functions } from 'firebase'
import akarata from 'akarata'
import sentiment from 'multilang-sentiment'

var buttons = require( 'datatables.net-buttons' )( window, $ );
var Regex = require("regex")

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
            'hasil_post' :doc.data().hasilPost[index]
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
          s.id, 
          s.alamat_domain ,
          s.judul_artikel, 
          s.hasil_post.kategori_post, 
          s.hasil_post.label_post,
          s.hasil_post.score,
          s.tanggal_artikel,
          s.konten_artikel, 
          s.hasil_post,
          s.hasil_post.positive, 
          s.hasil_post.negative
        ]
      })
      //Load Datatables.net
      $('#tabel-hasil').ready(() => {
        $('#tabel-hasil').DataTable(
          {
            data,
            columns : [
              { title : "ID"},
              { title : "Alamat Domain"},
              { title : "Judul Artikel"},
              { title : "Kategori Artikel"},
              { title : "Label Artikel"},
              { title : "Skor Artikel"},
              { title : "Tanggal Post"},
              { title : "Konten Artikel"},
              { title : "Sentimen Artikel"},
              { title : "Kata Positif"},
              { title : "Kata Negatif"},
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
        this.sentiments[index].hasil_post = sentimentResult
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
      // this.sentiments.forEach((data,index) => { 
        // const string = this.sentiments[index].judul_post
        //regex under category 'UGM'
        const regex = /UGM|ugm|Universitas Gadjah Mada|Hello/
        const isExisting = regex.test(string)


        //regex under category 'Prestasi'
        const regexPrestasi = /prestasi|berhasil|bangga|kebanggaan|penemuan|raih|meraih|penghargaan|menang|memenangkan/
        const isExistingPrestasi = regexPrestasi.test(string)


        //etc (customisable)
        const regexKejahatan = /kasus|pelaku|tersangka|jahat|barang bukti|alibi|bersalah|penjara|korban|ditangkap/
        const isExistingKejahatan = regexKejahatan.test(string)
        const regexPengalaman = /Pengalaman|sharing|cerita/
        const isExistingPengalaman = regexPengalaman.test(string)
        const regexTutorial = /tutorial|kiat-kiat|cara|how to|kiat/
        const isExistingTutorial = regexTutorial.test(string)
        const regexCyber = /(?=.*Cyber)(?=.*Campus)/
        const isExistingCyber = regexCyber.test(string)


        //categories   
        let category = "unset"
        if (isExistingPrestasi == true) {
          category = "Prestasi"
        } 
        
        else if (isExisting == true) {
          category = "UGM"
        } 
        
        else if (isExistingKejahatan == true) {
          category = "Kasus"
        } else if (isExistingPengalaman == true) {
          category = "Pengalaman"
        } else if (isExistingTutorial == true) {
          category = "Kiat-kiat"
        } else if (isExistingCyber == true) {
          category = "Cyber Campus"
        }
          else {
          category = "Lain"
        }
        return category
    },
  }
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
#tabel-hasil th, td {
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


