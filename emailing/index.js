var mandrill=require("mandrill-api/mandrill");
var mandrillClient=new mandrill.Mandrill("ZraZpvNS5AbqnzqZnSmh2g");

/*mandrillClient.users.info({},function (results) {
    console.log(results);
},function(e){
    console.log(e);
});*/
var plugin=function(options){
    var seneca=this;
    seneca.add({area:"email",action:"send"},function(args,done)
    {
        console.log(args);
        var message={
            "html":args.content,
            "subject":args.subject,
            "to":[{
                "email":args.to,
                "name":args.name,
                "type":"to"
            }],
            "from_email":"ismailrei@gmail.com",
            "from_name":"ismailrei"
        }
        mandrillClient.messages.send({"message":message},
        function(result){
            done(null,{status:result.status});
        },function(e)
        {
            done({code:e.name},null);//return e.name at the error
        });
    })
    .add({area:"email",action:"send",cc:"*"},function(args,done)
    {
        console.log(args);
        var message={
            "html":args.content,
            "subject":args.subject,
            "to":[{
                "email":args.to,
                "name":args.name,
                "type":"to"
            },
                "email":args.cc,
                "name":args.ccName,
                "type":"cc"
            ],
            "from_email":"ismailrei@gmail.com",
            "from_name":"ismailrei"
        }
        mandrillClient.messages.send({"message":message},
        function(result){
            done(null,{status:result.status});
        },function(e)
        {
            done({code:e.name},null);//return e.name at the error
        });
    })
}
module.exports=plugin;

var seneca=require("seneca")();
seneca.use(plugin)
      .act({area:"email",action:"send",subject:"the subject",to:"ismailrei@gmail.com",name:"reida"},function(err,result){
          console.log(err);
          console.log(result);
      })  
