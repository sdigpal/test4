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

exports.initialize = function() {
    return new Promise((resolve, reject) => {
        sequelize.sync()
        .then(() => resolve())
        .catch(() => reject("unable to sync the database"));
    });
};

exports.prep = ()=>{
    return new Promise((resolve,reject) => {
        sequelize.sync()
        .then(resolve(Student.findAll()))
        .catch(reject('no results returned'));
    })
};

exports.bsd = ()=>{
    return new Promise((resolve, reject)=>{
       Student.findAll({
        where: {
            program: "BSD"
        }
       }).then(data => {
        resolve(data)
    }).catch(err => reject("no results returned"))
    });
}


exports.cpa = ()=>{
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: {
                program: "CPA"
            }
        }).then(data => {
            resolve(data)
        }).catch(err => reject("no results returned"))
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
    return new Promise((resolve,reject) => {
        for (var i in stud) {
            if (stud[i] == "") { stud[i] = null; }
        }
    
        Student.create(stud)
        .then(resolve(Student.findAll()))
        .catch(reject('unable to add Student'))
    })
};

exports.getStudent = (studId)=>{
    return new Promise((resolve, reject)=>{
        students.forEach(function(student){
            if (student.studId == studId)
                resolve(student);
        });
        reject("No result found!");
    })
}
