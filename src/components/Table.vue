<template>
    <div id="table" class="container-fluid pt-5 mt-5">
        <h3>Download Sentiment CSV</h3>
        <p> Berikut ditampilkan full-table dari hasil analisis sentimen.<br>
            Hasil berikut diambil proses yang sebelumnya telah dilakukan, tabel bisa di-download melalui tombol-tombol berikut.</p>
        <div class="container-fluid">    
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
import { constants } from 'fs'
import { connect } from 'tls'
import { error } from 'util'

var buttons = require( 'datatables.net-buttons' )( window, $ );

export default {
    name: 'table',
    data () {
        return {
          //define local database
          sentiments : [],
          data : this.sentiments = [],
          data2 : [],
          columns: [],
        }
    },
    created () {
        //get data from firestore
        this.isLoading = true
        db.collection('sentiments').get().then(querySnapshot => { //ganti koleksi ya kalau mau dipake
            querySnapshot.forEach(doc => {
                //define data and push to local db
                const data = {
                    'id' : doc.id,
                    'judul_post' : doc.data().judulPost,
                    'konten_post' : doc.data().kontenPost,
                    'katadasar_post': doc.data().katadasarPost,
                    'hasil_post' : doc.data().hasilPost,
                    'score_post' : doc.data().hasilPost. score,
                    'positive_post' : doc.data().hasilPost. positive,
                    'negative_post' : doc.data().hasilPost. negative,
                    'label_post': doc.data().labelPost,
                    'ekstrak_post': doc.data().ekstrakPost,
                    'kategori_post' : doc.data().kategoriPost,
                }
                this.sentiments.push(data)
            })
            this.isLoading = false
        }).then(() => {
          this.createTable()          
        })
        this.data = this.sentiments 
    },
    methods :{
       createTable() {
        //s.hasil_post, s.score_post, s.negative_post, s.label_post, s.kategori_post  ini kekurangannya
            const data = this.sentiments.map(s => {
                return [s.id, s.judul_post, s.konten_post, s.hasil_post, s.score_post, s.positive_post, s.negative_post, s.label_post, s.kategori_post]
            })
            //Load Datatables.net
            $('#tabel-hasil').ready(() => {
                $('#tabel-hasil').DataTable(
                {
                    data,
                    columns : [
                    { title : "ID"},
                    { title : "Judul Post"},
                    { title : "Konten Post"},
                    { title : "Hasil Post"},
                    { title : "Skor Post"},
                    { title : "Kata Positif"},
                    { title : "Kata Negatif"},
                    { title : "Label Post"},
                    { title : "Kategori Post"},
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
    }
}
</script>

<style>
#tabel-hasil th, td {
  vertical-align: top;
}
</style>

