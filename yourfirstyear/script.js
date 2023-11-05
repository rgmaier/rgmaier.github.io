function setMonthNavigation(){
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const month_short = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    $('#navMonthLeft').children('.d-md-block').each(function(i){
        if((parseInt(sessionStorage.getItem("WeddingDate").substring(5,7),10)-1+i) < 12){
            month_txt_l = month[parseInt(sessionStorage.getItem("WeddingDate").substring(5,7),10)-1+i];
            year_txt = parseInt(sessionStorage.getItem("WeddingDate").substring(2,4),10);
        }
        else{
            month_txt_l = month[parseInt(sessionStorage.getItem("WeddingDate").substring(5,7),10)-1+i-12];
            year_txt = parseInt(sessionStorage.getItem("WeddingDate").substring(2,4),10)+1;
        }
        $(this).text(month_txt_l+" "+year_txt);
        $(this).attr('title',month_txt_l+" "+year_txt);
    });

    $('#navMonthLeft').children('.d-md-none').each(function(i){
        if((parseInt(sessionStorage.getItem("WeddingDate").substring(5,7),10)-1+i) < 12){
            month_txt_s = month_short[parseInt(sessionStorage.getItem("WeddingDate").substring(5,7),10)-1+i];
            month_txt_l = month[parseInt(sessionStorage.getItem("WeddingDate").substring(5,7),10)-1+i];
            year_txt = parseInt(sessionStorage.getItem("WeddingDate").substring(2,4),10);
        }
        else{
            month_txt_s = month_short[parseInt(sessionStorage.getItem("WeddingDate").substring(5,7),10)-1+i-12];
            month_txt_l = month[parseInt(sessionStorage.getItem("WeddingDate").substring(5,7),10)-1+i-12];
            year_txt = parseInt(sessionStorage.getItem("WeddingDate").substring(2,4),10)+1;
        }
        $(this).text(month_txt_s+" "+year_txt);
        $(this).attr('title',month_txt_l+" "+year_txt);
    });
    loadMonthContents($('#navMonthLeft .active:first'))
}

function setActiveMonth(handle){

    //Deactivating the no longer active element and then activating the new one
    $('#navMonthLeft').find('.active').removeClass('active');
    $('#navMonthLeft').find('.active').removeAttr('aria-current');
    $('#navMonthLeft').children().each(function(i){
        if($(handle).attr('title')===$(this).attr('title')){
            $(this).attr('aria-current',true);
            $(this).addClass('active');
        }
    });

    //Adjusting the header to the new month
    loadMonthContents(handle);
}

function loadMonthContents(handle){
    $('span.display-5').text($(handle).attr('title'));
    var contents = JSON.parse(sessionStorage.getItem('contents'));
    if(contents == null){
        $('#currentMonthContent').val("");
        $('#describeGiftText').val("");
    } else {
        key = $('#navMonthLeft .active:first').attr('title');
        if(key in contents){
            $('#currentMonthContent').val(contents[key]['message']);
            $('#describeGiftText').val(contents[key]['gift']);
        }
        else{
            $('#currentMonthContent').val("");
            $('#describeGiftText').val("");
        }      
    }
}

function saveMonthContents(){
    var contents = JSON.parse(sessionStorage.getItem('contents'));
    if(contents == null){
        contents = {};
    }
    var monthContent = {};
    if($('#currentMonthContent').val().length!=0 || $('#describeGiftText').val().length!=0){
        monthContent['message'] = $('#currentMonthContent').val();
        monthContent['gift'] = $('#describeGiftText').val();
        key = $('#navMonthLeft .active:first').attr('title');
        contents[key] = monthContent;
        sessionStorage.setItem('contents',JSON.stringify(contents));
    }
    //No else necessary I think - maybe give a toast to let people know nothing has changed?
    //Confirmation necessary that it saved? Probably better to move to autosave anyway
    
    //On save, add list-group-item-success if both message and gift are set - call new function, iterate through whole list.
    updateMonthStatus();
}

function updateMonthStatus(){
    //Check if there is data saved in sessionStorage. If both message & gift is set, then update background color
    $('#navMonthLeft').children().each(function(i){
        $(this).removeClass('list-group-item-success');
    });
    var contents = JSON.parse(sessionStorage.getItem('contents'));
    if(contents != null){
        for(var key in contents){
            if(contents[key]['message'].length != 0 && contents[key]['gift'].length !=0)
            {
                $(`[title='${key}'`).addClass('list-group-item-success');
            }
        }
        
    }
    enableSubmitButton();
}

function enableSubmitButton(){
    var contents = JSON.parse(sessionStorage.getItem('contents'));
    if(content != null){
        if(Object.keys(contents).length==12){
            var completed = true;
            for(key in contents){
                if(contents[key]['message'].length == 0 || contents[key]['gift'].length == 0)
                {
                    completed = false;
                }
            }
    
            if(completed){
                $('#submitContent').removeAttr('disabled');
            }
        }
    }
    
   
}

$(document).ready(function(){
    
    $('#initialForm').submit(function(e){
        sessionStorage.setItem("UserName",$('#UserName').val());
        sessionStorage.setItem("UserEmail",$('#UserEmail').val());
        sessionStorage.setItem("NewlywedsEmail",$('#NewlywedsEmail').val());
        sessionStorage.setItem("WeddingDate",$('#WeddingDate').val());
        sessionStorage.removeItem("contents");
        $(location).attr('href',"main.html");
        e.preventDefault();
    });

    if($('#navMonthLeft').length){
        setMonthNavigation();
        updateMonthStatus();
    }


    $('#navMonthLeft a').on('click',function(){
        setActiveMonth(this);
        $('.collapse').collapse('hide');
    });

    $('#saveContent').on('click',function(){
        saveMonthContents();
    });

    $('#giftSelector button').on('click',function(){
        $('.collapse').collapse('hide');
    })

});