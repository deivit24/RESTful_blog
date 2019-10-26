// Init Variables and Packages

const express =require("express"),
	  bodyParser = require("body-parser"),
	  methodOverride = require("method-override"),
	  mongoose = require("mongoose"),
	  app = express()

// using body  parser

app.use(bodyParser.urlencoded({ extended: true }));

// setting view engine for ejs and custom style sheet

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(methodOverride("_method"));

// Mongoose set up

mongoose.connect('mongodb://localhost:27017/restful_blog_app', {useNewUrlParser: true});

// Set up Schema/Model Config

let blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
	
});


let Blog = mongoose.model("Blog", blogSchema);




// RESTful ROUTES

// INDEX ROUTE
app.get("/", (req,res) => {
		res.redirect("/blogs")
		});

app.get("/blogs", (req,res) => {
	Blog.find({}, (err, blogs) =>{
			  if(err) {
		console.log("error!");
	}else {
		res.render("index", {blogs: blogs})
	}
			  })
		
		});

// NEW ROUTE
app.get("/blogs/new", (req, res) => {
	res.render("new");
});

// CREATE ROUTE
app.post("/blogs", (req, res) => {
	let data = req.body.blog;
	Blog.create(data, (err, newBlog) => {
		if(err) {
			res.render('new');
		} else{
			res.redirect("/blogs");
		}
	})
})

// SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
	let id = req.params.id;
	Blog.findById(id, (err, foundBlog) => {
		if(err) {
			console.log("error!");
			res.redirect("/blogs")
		}else {
			res.render("show", {blog: foundBlog});
		}
	})
})


// Edit ROUTE
app.get("/blogs/:id/edit", (req, res) => {
	let id = req.params.id;
	Blog.findById(id, (err, foundBlog) => {
		if(err) {
			console.log("error!");
			res.redirect("/blogs")
		}else {
			res.render("edit", {blog: foundBlog});
		}
	})
})

// UPDATE ROUTE
app.put("/blogs/:id", (req, res) => {
	let id = req.params.id;
	Blog.findByIdAndUpdate(id, req.body.blog, (err, updatedBlog) => {
		if(err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + id);
		}
	})
});

// DESTROY/DELETE Route
app.delete("/blogs/:id", (req, res) => {
	// destroy blog
	let id = req.params.id;
	Blog.findByIdAndRemove(id, (err) => {
		if(err) {
			res.redirect("/blogs");
		}else {
			res.redirect("/blogs");
		}
	})
	
})
function myFunction() {
   var x;
     if (confirm("Are you sure?") == true) {
         x = "You pressed OK!";
     } else {
         x = "You pressed Cancel!";
     }
     return x; 
}
app.listen(3000, () => {
	console.log("server is running");
});