const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to Mdb");
  })
  .catch((err) => {
    console.error("Could not connect to Mdb", err);
  });

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    //match:/pattern/
  },
  category: {
    type: String,
    enum: ["web", "mobile", "network"],
    required: true,
    lowercase:true,
    // uppercase:true,
    trim:true
  },
  author: String,
  tags: {
    type: Array,
    validate: {
      isAsync: true,
      validator: function (v, callback) {
        //do async work
        setTimeout(() => {
          const result = v && v.length > 0;
          callback(result);
        }, 4000);
       
      },
      message: "A course should have at least one tag",
    },
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  //canot use arrow function here
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
    min: 10,
    max: 200,
    get:v=>Math.round(v),
    set:v =>Math.round(v)
  },
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "PHP Course",
    author: "Baxan",
    tags: ["PHP", "frontend","backend"],
    isPublished: true,
    price: 50.1,
    category: "WEB    ",
    
  });
  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    for(field in ex.errors){
        console.log(ex.errors[field].message)
    }
  }
}

createCourse();

async function getCourse() {
  //eq(equal)
  //ne(not equal)
  //gt(grtr than)
  //gte(grtr than or equal to)
  //lt(less than)
  //lte(less than or equal to)
  //in
  //nin(not in)

  //or and

  const pageNumber = 2;
  const pageSize = 10;

  const courses = await Course

    //   find({price:{$gt:10, $lte:20}})
    // .find({ price: { $in: [10, 12, 20] } })

    // find({author:'Baxan', isPublished:true})

    // .find()
    // .and([{author:'Baxan'},{isPublished:true}])

    //starts with Bax
    // .find({author: /^Bax/ })

    //ends with an i is for case insensitive
    // .find({author:/aN$/i})

    //contanis ax
    .find({ author: /.*aX.*/i })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize) //total record
    .sort({ name: 1 }) //desc asc
    .select({ name: 1, tags: 1 }); //select specifice
  // .count()
  console.log(courses);
}
//getCourse();

async function updateCourse(id) {
  //query first
  //   const course = await Course.findById(id);
  //   if (!course) return;
  //   course.isPublished = true;
  //   course.author = "Another";

  //   //same

  //   // course.set({
  //   //     isPublished:true,
  //   //     author:'Another'
  //   // })
  //   const result = await course.save();
  //   console.log(result);

  //update first  //operator update
  const course = await Course.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        author: "Baxan",
        isPublished: false,
      },
    },
    { new: true }
  );
  console.log(course);
}
//updateCourse('5eaa831ce1b5d5367aef215f');

async function removeCourse(id) {
  //const result=  await Course.deleteOne({_id:id})
  const course = await Course.findByIdAndDelete({ _id: id });
  //console.log(result)
  console.log(course);
}
//removeCourse('5eaa83a207310bdfb94942b7')
