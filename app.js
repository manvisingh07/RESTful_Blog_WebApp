var bodyparser  =require("body-parser"),
methodoverride  =require("method-override"),
      mongoose  =require("mongoose"),
      express   =require("express"),
expresssanitizer=require("express-sanitizer"),
      app       =express();

//app config
mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(methodoverride("_method"));
app.use(expresssanitizer());

//Mongoose/model config
var blogSchema=new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var blog= mongoose.model("blog",blogSchema);

//RESTful ROUTES
app.get("/",function(req,res){
    res.redirect("/blogs")
})

//INDEX ROUTE
app.get("/blogs",function(req,res){
    blog.find({},function(err,blogs){
        if(err)
        console.log("ERROR!!!")
        else
        res.render("index",{blogs: blogs});
    })
})

//NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new")
})

//CREATE ROUTE
app.post("/blogs",function(req,res){
    //create blog
    req.body.blog.body=req.sanitize(req.body.blog.body)
    blog.create(req.body.blog, function(err, newblog){
        if(err)
        console.log("ERROR!!!!!!!!!")
        else
        {
          //then, redirect to the index
           res.redirect("/blogs") 
        }
    })
  
})

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
blog.findById(req.params.id, function(err, foundblog){
    if(err)
    res.redirect("/blogs")
    else
    {
        res.render("show",{blog:foundblog})
    }
})
})

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id,function(err,foundblog){
        if(err)
        res.redirect("/blogs")
        else
        res.render("edit",{blog: foundblog})
    })
})

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body)
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
        if(err)
        res.redirect("/blogs")
        else
        {
            res.redirect("/blogs/" + req.params.id)
        }
    })
 
})

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
//destroy  //redirect
blog.findByIdAndDelete(req.params.id,function(err){
    if(err)
    res.redirect("/blogs")
    else
    res.redirect("/blogs")
})
})


app.listen(3000,function(){
    console.log("SERVER HAS STARTED!!")
})