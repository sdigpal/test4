const Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'user', 'password', {
 host: 'host',
 dialect: 'postgres',
 port: 5432,
 dialectOptions: {
 ssl: true
},
query:{raw: true} // update here, you. Need this
}); 

sequelize.authenticate().then(()=> console.log('Connection success.'))
.catch((err)=>console.log("Unable to connect to DB.", err));

var fs = require("fs");
var students=[];
exports.prep = ()=>{
    return new Promise((resolve,reject) => {
        sequelize.sync()
        .then(resolve(Student.findAll()))
        .catch(reject('no results returned'));
    })
};

exports.bsd = ()=>{
    return new Promise((resolve, reject)=>{
       let results = students.filter(student => student.program == "BSD");
       (results.length == 0)? reject("No BSD students."):resolve(results);
    });
}


exports.cpa = ()=>{
    return new Promise((resolve, reject)=>{
       let results = students.filter(student => student.program == "CPA");
       (results.length == 0)? reject("No CPA students."):resolve(results);
    });
}
exports.highGPA = ()=>{
    return new Promise((resolve, reject)=>{
        let high = 0;
        let highStudent;
        
        for (let i=0; i<students.length; i++)
        {
            //console.log(students[i].gpa, high);
            if (students[i].gpa > high)
            {
                high = students[i].gpa;
                highStudent = students[i];
            }
        }
        (highStudent) ? resolve(highStudent): reject("Failed finding student with highest GPA");
    }); 
};

exports.lowGPA = ()=>{
    return new Promise((resolve, reject)=>{
        let low = 4.0;
        let lowStudent;
        for (let i=0; i<students.length; i++)
        {
            if (students[i].gpa < low)
            {
                low = students[i].gpa;
                lowStudent = students[i];
            }
        }
        resolve(lowStudent);
    }); 
};

exports.allStudents =()=>{
    return new Promise((resolve, reject)=>{
        if (students.length>0)
        {
            resolve(students);
        } else reject("No students.");
    })
}

exports.addStudent= (stud)=>{
    return new Promise((resolve, reject)=>{
        stud.studId = students.length+1;
        students.push(stud);
        resolve();
    });
}

exports.getStudent = (studId)=>{
    return new Promise((resolve, reject)=>{
        students.forEach(function(student){
            if (student.studId == studId)
                resolve(student);
        });
        reject("No result found!");
    })
}
