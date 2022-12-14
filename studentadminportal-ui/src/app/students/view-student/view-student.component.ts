import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {

  studentId: string | null | undefined;
  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 0,
    genderId: '',
    profileImageUrl: '',
    gender: {
      id: '',
      description: ''
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: ''
    }
  };

  isNewStudent = false;
  header = '';
  displayProfileImageUrl = '';



  genderList: Gender[] = [];

  constructor(private readonly studentService: StudentService,
    private readonly route: ActivatedRoute, private readonly genderService: GenderService,
    private snackbar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.studentId = params.get('id');

      if(this.studentId){

        if(this.studentId.toLocaleLowerCase() === 'Add'.toLocaleLowerCase()){
          this.isNewStudent = true;
          this.header = 'Add New Student';
          this.setImage();
        }
        else{
          this.isNewStudent = false;
          this.header = 'Edit Student'

          this.studentService.getStudent(this.studentId).subscribe((succesResponse)=>{
            this.student = succesResponse;
            this.setImage();
          });
        }


      }

      this.genderService.getGenderList().subscribe((succesResponse)=>{
        this.genderList = succesResponse;
      });

    })

  }

  onUpdate():void {
    this.studentService.updateStudent(this.student.id, this.student)
    .subscribe((succesResponse)=>{
      this.snackbar.open("Student updated successfully", undefined, {duration: 200});
    }
    )
  }

  onDelete():void{
    this.studentService.deleteStudent(this.student.id).subscribe((succesResponse)=>{
      this.snackbar.open("Student deleted succefully", undefined, {
        duration: 2000
      });

      setTimeout(()=>{
        this.router.navigateByUrl('students');
      }, 2000);


    })
  }

  onAdd():void{
    this.studentService.addStudent(this.student).subscribe((succesResponse)=>{

      this.snackbar.open("Student added succefully", undefined, {
        duration: 2000
      });

      setTimeout(()=>{
        this.router.navigateByUrl('students');
      }, 2000);


    });
  }

  private setImage():void{
    if(this.student.profileImageUrl){
      this.displayProfileImageUrl =   this.studentService.getImagePath(this.student.profileImageUrl);
    }
    else{
      this.displayProfileImageUrl = '/assets/user.png';
    }
  }

  uploadImage(event: any):void{
    if(this.studentId){
      const file: File = event.target.files[0];
      this.studentService.uploadImage(this.student.id, file).subscribe((succesResponse)=>{
        this.student.profileImageUrl = succesResponse;
        this.setImage();

        this.snackbar.open("Image uploaded succefully", undefined, {
          duration: 2000
        });


      });
    }
  }

}
