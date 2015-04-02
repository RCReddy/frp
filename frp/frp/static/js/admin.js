var AdminPage = function(campaign_data) 
{
  var that = this;
  this.campaign_data = campaign_data;
  this.start = function() 
  {
    this.show_campaigns(this.campaign_data);
    $('#campaigns').on('change', 'select', function(e) 
                       {
                         var id = $(this).parents('tr').attr('id');
                         var status = $(this).val();
                         $.ajax({
                           type: "POST",
                           url: "/change_status",
                           data:{ 
                             campaign_id : id,
                             updated_status: status
                           },
                           success: function(data){
                             that.replace_campaign_data(data);
                             alert("Status of campaign : " + id + " changed to: " + status);
                           },
                           error: function(errMsg) {
                             alert(errMsg);
                           }
                         });
                       });

    $('#campaigns').on('click', '.btn.btn.approve', function(e) 
                       {
                         var id = $(this).parents('tr').attr('id');
                         var status = "Approved";
                         $.ajax({
                           type: "POST",
                           url: "/change_status",
                           data: {
                             campaign_id : id,
                             updated_status: status
                           },
                           success: function(data){
                             that.replace_campaign_data(data);
                             alert("Status of campaign [ " + data.title + " ] changed to: " + status);
                           },
                           error: function(data) {
                             alert("Change status failed")
                           }
                         });
                       });
    $('#campaigns').on('click','.btn.btn-comment',function(e)
                       {
                          var id = parseInt($(this).parents('tr').attr('id'));
                          $('#myModal1').find(".modal-content").attr('id',"modal"+id);
                          $('#myModal1').find('.form-group').find("tr").remove();
                       });

    $('#myModal1').on('click','#comment-submit-btn',function(e)
                       {
                         var comment = $('#myModal1').find('#comments').val()
                         var id = parseInt($(this).parents('.modal-content').attr('id').slice(5));
                         $.ajax({
                           type: "POST",
                           url: "/comment",
                           data:{ 
                             campaign_id : id,
                             comment: comment
                           },
                           success: function(data){
                               // Remove old comments if present and then show all comments
                               $('#myModal1').find(".modal-content").attr('id',"modal"+id).children().find('tr').remove()
                               var  comments=data.comment;
                               var $modal_form = $('#myModal1').find('.form-group');
                               var $modal_content = $('#myModal1').find(".modal-content").attr('id',"modal"+id);
                               /* Load comments*/
                               for  (i=0; i<comments.length;i++)
                                 {
                                   var $p =$('<tr/>').appendTo($modal_form);
                                   $('<p/>').html(comments[i].comment).appendTo($p);
                                   $('<p/>').addClass("text-danger").html(comments[i].by).appendTo($p);
                                   $('<p/>').addClass("text-success").html(comments[i].date).appendTo($p);
                                 }
                           },
                           error: function(errMsg) {
                             alert("Update failed");
                           }
                         });
                       });

    $('#myModal1').on('click','#comment-show-btn',function(e)
                      {
                        $('#myModal1').find('.form-group').find("tr").remove();
                        var id = parseInt($(this).parent().attr('id').slice(5));
                        //that.comments = []
                        $.ajax({
                          type: "GET",
                          url: "/comment",
                          data:{ "campaign_id" :id},
                          success: function(data){
                          var  comments=data.comment;
                          if (comments.length != 0)
                            {
                              var $modal_form = $('#myModal1').find('.form-group');
                              var $modal_content = $('#myModal1').find(".modal-content").attr('id',"modal"+id);
                              /* Load comments*/
                              for  (i=0; i<comments.length;i++)
                                {
                                  var $p =$('<tr/>').appendTo($modal_form);
                                  $('<p/>').html(comments[i].comment).appendTo($p);
                                  $('<p/>').addClass("text-danger").html(comments[i].by).appendTo($p);
                                  $('<p/>').addClass("text-success").html(comments[i].date).appendTo($p);
                                }
                              }
                            else
                              {
                                alert("There are no comments for this campaign");
                              }
                            },
                          failure: function(errMsg) {
                            alert("Get Failed");
                          }
                        });
                      });

  };// start function 

  this.replace_campaign_data = function(campaign)
  {
    var $row = this.get_campaign(campaign);
    $('#campaigns tr#'+campaign.id).replaceWith($row);
  };

  this.get_campaign = function(data) 
  {
    var $row = $('<tr id =' + data.id +'/>')
    //var $id = $('<td/>').html("<a href=/campaign/"+data.id+ ">" + data.id+"</a>").appendTo($row);
    var $title = $('<td/>').html("<a href=/campaign/"+data.id+ ">"+data.title+"</a>").addClass('title').appendTo($row);
    var $who = $('<td/>').html(data.who).appendTo($row);
    var $city= $('<td/>').html(data.city).appendTo($row);
    var $target = $('<td/>').html(data.target).appendTo($row);
    var $start_date = $('<td/>').html(data.start_date).appendTo($row);
    var $end_date = $('<td/>').html(data.end_date).appendTo($row);
    var $span = $('<span/>').addClass('label label-info').html(data.status);
    var $status = $('<td>').append($span).appendTo($row);
    var $button = $('<button type="button"/>').addClass('btn approve').html('Approve');
    $('<td>').append($button).appendTo($row);


    var arr = [
      {val : 'Submitted', text: 'Submitted'},
      {val : 'Approved', text: 'Approved'},
      {val : 'Completed', text: 'Completed'},
      {val : 'Ended', text: 'Ended'},
      {val : 'Delivered', text: 'Delivered'},
      {val : 'Not Approved', text: 'Not Approved'},
      {val : 'Closed', text: 'Closed'},
      {val : 'Extended', text: 'Extended'},
      {val : 'Shipped', text: 'Shipped'},
      {val : 'Flagged', text: 'Flagged'}
    ];

    var $sel = $('<select/>').addClass('label label-info');
    $(arr).each(function() {
      $sel.append($("<option>").attr('value',this.val).text(this.text));
    });
    $('<td/>').append($sel).appendTo($row);
    $('<td/>').html(data.num_donors).appendTo($row);

    var $butn = $('<button type="button"/>').attr("data-toggle","modal").attr("data-target","#myModal1").attr("id",'butn'+data.id).addClass("btn btn-comment");
    $('<td/>').append($butn).appendTo($row);

    return $row;

  };

  this.show_campaigns = function(campaigndata) 
  {
    var $campaigns = $('#campaigns');
    for (i = 0; i < campaigndata.length; i++) 
    {
      var $row=this.get_campaign(campaigndata[i])
      $row.appendTo($campaigns);
    }
  };
};

