
var copyTracker=[]
function verifySDD(){

    document.getElementById("recommendedterms").style.display="none";
    document.getElementById("recommendedcolumn").style.display="none";
    //document.getElementById("editRowsAdd").style.display="none";
    document.getElementById("verifysdd").style.display="flex";
    document.getElementById("verifysdd").style.justifyContent="center";
    document.getElementById("verifysdd").style.margin="0 auto";
    document.getElementById("menulist").style.display="none";
    document.getElementById("virtuallist").style.display="none";
    document.getElementById("returnView").style.display="block";
    document.getElementById("searchForTerm").style.display="none";
    document.getElementById("numToSearch").style.display="none";
    document.getElementById("numberResults").style.display="none";
    
    
  


    if(cdg.data.length!=copyOfR){
        
        cdg.deleteRow(copyOfR);
    }
   
     document.getElementById("irifound").innerHTML = "";
    // document.getElementById("irinotfound").innerHTML = "";
    
    
    
    for (var i=1;i<copyOfR;i++){
      for(var j=1;j<copyOfL;j++){
          
          if(cdg.data[i][j]==null ||cdg.data[i][j].startsWith("??")||cdg.data[i][j]==''||cdg.data[i][j]==' * '){
            
          }
          else{
            
            var cellItem=cdg.data[i][j];
            if(cellItem.endsWith(" * ")){
                
                cellItem=cellItem.replace(" * ",'');
                
            }
            
           
            var label= cellItem;

            copyTracker=verifyLabel(label,i,j);
            // var label1 = label.split(":")[0];
            // var label2 = label.split(":")[1];
            // getOwlUrl(label1,label2,label,i,j);
          }
        
        
        }
      }
      displayVerify(copyTracker);
    
    }
    var trackofLabelValidity=[];
    function verifyLabel(label,i,j){
        
        $.ajax({
                type : 'GET',
                url : 'http://localhost:9000/hadatac/sddeditor_v2/validateIRI',
                data : {
                    s:label
                },
                async: false,
                success : function(data) {
                   
                    var temp=[];
                    if(data==true){
                       
                        temp.push("true");
                        temp.push(label);
                        temp.push(i);
                        temp.push(j);
                        
                        trackofLabelValidity.push(temp);
                    }
                    else if(data==false){
                        
                        temp.push("false");
                        temp.push(label);
                        temp.push(i);
                        temp.push(j);
                        
                        trackofLabelValidity.push(temp);
                    }
                    
                    
                    
                }
                
        });
        return trackofLabelValidity;
       
        
    }
function displayVerify(copyTracker){
        
    var bool_=[];
    var errorsFound=[];
    for(var i=0;i<copyTracker.length;i++){
        
        if(copyTracker[i][0]=="true"){
            
            bool_.push(0);
        }
        else if(copyTracker[i][0]=="false"){
            bool_.push(1);
           
        }
    }
    // console.log(bool)
    if((bool_.every(item => item === 0))==true){
        noErrorsFunction();
    }
    else{
        for(var i=0;i<bool_.length;i++){
            if(bool_[i]==1){
                var tem=[];
                tem.push(copyTracker[i][1]);
                tem.push(copyTracker[i][2]);
                tem.push(copyTracker[i][3]);
                errorsFound.push(tem);
            }
        }
        errorsFoundDisplay(errorsFound);
    }
}
function noErrorsFunction(){
    document.getElementById('irifound').innerHTML="";
    var b1 = document.createElement("button");
    b1.style.backgroundColor="lavender";
    b1.style.fontWeight="bold";
    b1.style.color="green";
    b1.style.border="transparent";
    b1.style.border="0";
    b1.style.width="100%";
    b1.style.fontFamily="Optima, sans-serif";
    b1.style.fontsize="14pt";
    b1.style.textAlign="center";
    b1.innerHTML="No Errors Found!"+"<br />";
    document.getElementById('irifound').appendChild(b1);
}
function errorsFoundDisplay(errorsFound){
    
    document.getElementById('irifound').innerHTML="";
        var b = document.createElement("button");
        b.style.backgroundColor="lavender";
        b.style.fontWeight="bold";
        b.style.color="g";
        b.style.border="transparent";
        b.style.border="0";
        b.style.width="100%";
        b.style.fontFamily="Optima, sans-serif";
        b.style.fontsize="14pt";
        b.style.textAlign="center";
        b.innerHTML=errorsFound.length+" Error(s) found! "+"<br />";
        document.getElementById('irifound').appendChild(b);
    for(var i=0;i<errorsFound.length;i++){
        var b1 = document.createElement("button");
        b1.style.backgroundColor="lavender";
        b1.style.fontWeight="bold";
        b1.style.color="maroon";
        b1.style.border="1px";
        b1.style.borderColor="black";
        b1.style.border="0";
        b1.style.width="100%";
        b1.style.fontFamily="Optima, sans-serif";
        b1.style.fontsize="14pt";
        b1.style.textAlign="center";
        b1.innerHTML=errorsFound[i][0];
        document.getElementById('irifound').appendChild(b1);
        if (document.addEventListener) { // IE >= 9; other browsers
            b1.addEventListener('click', function(e) {
              
                for(var j=0;j<errorsFound.length;j++){
                    
                    if(errorsFound[j][0]==this.innerHTML){
                    
                        cdg.gotoCell(errorsFound[j][1], errorsFound[j][2])
                    }
                }
                }, false);
        }
        
    }

}


function externalValidate(f_id){
    
   
    document.getElementById("irifound").style.display="inline-block";
    document.getElementById('irifound').innerHTML="";
    if(document.getElementById('irifound').innerHTML==""){
        document.getElementById('loadingmsg').innerHTML="Verifying . . .";
        var loader = document.createElement("img");
        loader.setAttribute("src", "https://thumbs.gfycat.com/SkinnySeveralAsianlion-max-1mb.gif");
        loader.setAttribute("height", "30");
        loader.setAttribute("width", "30");
        document.getElementById('loadingmsg').appendChild(loader);
    }
    else if(document.getElementById('irifound').innerHTML!=""){
        document.getElementById('loadingmsg').innerHTML="";
        
    }
    document.getElementById("recommendedterms").style.display="none";
    document.getElementById("recommendedcolumn").style.display="none";
    document.getElementById("editRowsAdd").style.display="none";
    document.getElementById("verifysdd").style.display="flex";
    document.getElementById("verifysdd").style.justifyContent="center";
    document.getElementById("verifysdd").style.margin="0 auto";
    document.getElementById("listingTable").style.display="none";
    document.getElementById("returnView").style.display="block";
    document.getElementById("searchForTerm").style.display="none";
    document.getElementById("numToSearch").style.display="none";
    document.getElementById("menulist").style.display="none";
    document.getElementById("virtuallist").style.display="none";
    document.getElementById("numberResults").style.display="none";
    var fid=f_id;
    
    $.ajax({
       type : 'GET',
       url : 'http://localhost:9000/hadatac/working/verifyDataFileTemp',
       data : {
         file_id:fid
       },
       success : function(data) {
          console.log(data);
          var annotationLogs = decodeURIComponent(data);
          annotationLogs=annotationLogs.replace(/&amp;lt;br&amp;gt;/g, '<br>').replace(/&amp;lt;/g, '&lt;').replace(/&amp;gt;/g, '&gt;');
          var arrayt= annotationLogs.split('&lt;br&gt;');
          
          
          console.log(arrayt);   
          
            
         
          for(var i=0;i<arrayt.length;i++){
            var timeType= arrayt[i].split('[WARNING]')[0];
            var errorTypeDescription= arrayt[i].split('[WARNING]')[1];
            var logType= arrayt[i].split('[LOG]')[0];
            var logErrorTypeDescription= arrayt[i].split('[LOG]')[1];
            if(arrayt[i].includes('[WARNING]')){
                var buttn = document.createElement("button");
                buttn.style.backgroundColor="Moccasin";
                buttn.style.color="black";
                buttn.style.fontWeight="bold";
                buttn.style.border="transparent";
                buttn.style.border="0";
                buttn.style.width="350px";
                buttn.style.fontFamily="Optima, sans-serif";
                buttn.style.fontsize="11pt";
                buttn.style.textAlign="center";
                buttn.innerHTML=timeType+" [WARNING]";
                document.getElementById('irifound').appendChild(buttn);

                var buttn2 = document.createElement("button");
                buttn2.style.backgroundColor="LemonChiffon";
                buttn2.style.color="black";
                buttn2.style.border="transparent";
                buttn2.style.border="0";
                buttn2.style.width="350px";
                buttn2.style.fontFamily="Optima, sans-serif";
                buttn2.style.fontsize="11pt";
                buttn2.style.textAlign="center";
                buttn2.innerHTML=errorTypeDescription;
                document.getElementById('irifound').appendChild(buttn2);
                document.getElementById('irifound').style.height="350px";
                if(document.getElementById('irifound').innerHTML!=""){
                    document.getElementById('loadingmsg').innerHTML="";
                }
                if (document.addEventListener) { // IE >= 9; other browsers
                    buttn.addEventListener('click', function(e) {
                        wrongterm= sheetdict.get(this.innerHTML);
                        var errRow=location[0];
                        var errCol=location[1];
                        cdg.gotoCell(errRow, errCol)
                        //alert(wrongterm,errRow,errCol);
                      
                   
                        
             
                    }, false);
                    
                 } 

            }
            else if(arrayt[i].includes('[LOG]')){
                var buttn = document.createElement("button");
                buttn.style.backgroundColor="lavender";
                buttn.style.color="black";
                buttn.style.fontWeight="bold";
                buttn.style.border="transparent";
                buttn.style.border="0";
                buttn.style.width="350px";
                buttn.style.fontFamily="Optima, sans-serif";
                buttn.style.fontsize="11pt";
                buttn.style.textAlign="center";
                buttn.innerHTML=logType+" [LOG]";
                document.getElementById('irifound').appendChild(buttn);

                var buttn2 = document.createElement("button");
                buttn2.style.backgroundColor="aliceblue";
                buttn2.style.color="black";
                buttn2.style.border="transparent";
                buttn2.style.border="0";
                buttn2.style.width="350px";
                buttn2.style.fontFamily="Optima, sans-serif";
                buttn2.style.fontsize="11pt";
                buttn2.style.textAlign="center";
                buttn2.innerHTML=logErrorTypeDescription;
                document.getElementById('irifound').appendChild(buttn2);
                if(document.getElementById('irifound').innerHTML!=""){
                    document.getElementById('loadingmsg').innerHTML="";
                }
            }
          }          

       }
    });
 }

 
