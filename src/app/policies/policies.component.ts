import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';



@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss']
})
export class PoliciesComponent implements OnInit {
  objectKeys = Object.keys;
  policies = {};
  b64decode;
  rawView = '';
  policyToDelete;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  newPolicy = {
  	name:"",
  	effect:"allow",
  	bucket:"",
  };

  newPolicyRaw = {
  	Version:"",
  	Statement: []
  }


  constructor(private apiService: ApiService) { }

  ngOnInit() {
  	this.getPolicies()


  	this.dropdownList = [
	    {"id":1,"itemName":"s3:AbortMultipartUpload"},
	    {"id":2,"itemName":"s3:CreateBucket"},
	    {"id":3,"itemName":"s3:DeleteBucket"},
	    {"id":4,"itemName":"s3:DeleteBucketPolicy"},
	    {"id":5,"itemName":"s3:DeleteObject"},
	    {"id":6,"itemName":"s3:GetBucketLocation"},
	    {"id":7,"itemName":"s3:GetBucketNotification"},
	    {"id":8,"itemName":"s3:GetBucketPolicy"},
	    {"id":9,"itemName":"s3:GetObject"},
	    {"id":10,"itemName":"s3:HeadBucket"},
	    {"id":11,"itemName":"s3:ListAllMyBuckets"},
	    {"id":12,"itemName":"s3:ListBucket"},
	    {"id":13,"itemName":"s3:ListBucketMultipartUploads"},
	    {"id":14,"itemName":"s3:ListenBucketNotification"},
	    {"id":15,"itemName":"s3:ListMultipartUploadParts"},
	    {"id":16,"itemName":"s3:PutBucketNotification"},
	    {"id":17,"itemName":"s3:PutBucketPolicy"},
	    {"id":18,"itemName":"s3:PutObject"},
	    {"id":19,"itemName":"s3:PutBucketLifecycle"},
	    {"id":20,"itemName":"s3:GetBucketLifecycle"}
    ];

    this.dropdownSettings = { 
		singleSelection: false, 
		text:"Select Actions",
		selectAllText:'Select All',
		unSelectAllText:'UnSelect All',
		enableSearchFilter: true	
	  };            
  	}

	onItemSelect(item:any){
	    console.log(item);
	    console.log(this.selectedItems);
	}
	OnItemDeSelect(item:any){
	    console.log(item);
	    console.log(this.selectedItems);
	}
	onSelectAll(items: any){
	    console.log(items);
	}
	onDeSelectAll(items: any){
	    console.log(items);
	}

  private resetPloicyForm(removeName){
  	console.log(removeName)
  	this.selectedItems = []
  	if(!removeName){
  		this.newPolicy.effect = "Allow"
		this.newPolicy.bucket = ""
  	}else{
  		this.newPolicy.name = "",
		this.newPolicy.effect = "Allow"
		this.newPolicy.bucket = ""
  	}
  	
  }

  private getPolicies(){
  	this.apiService.getPolicies().subscribe((data)=>{
      console.log(data);
      this.policies = data;
    });
  }

  private deletePolicy(){
  	this.apiService.deletePolicy(this.policyToDelete).subscribe((data)=>{
      console.log(data);
      this.getPolicies();
    });
  }

  public b64unpack(str){
    // console.log(JSON.parse(atob(str)))
  	return JSON.parse(atob(str));
  }

  private rawPrepare(obj){
  	this.rawView = obj;
  }

  private deletePolicyPrepare(policy){
  	this.policyToDelete = policy
  }

  private prepareNewPolicyRaw(){
  	this.newPolicyRaw = {
	  	Version:"2012-10-17",
	  	Statement: []
	}
  }

  private addStatement(){

  	var newStatement = {
  		Action: [],
  		Effect: "",
  		Resource: ""
  	}

  	if(this.selectedItems.length == 20){
  		newStatement.Action.push("s3:*")
  	}else{
	  	for (var i = 0; i < this.selectedItems.length; i++) {
	  		newStatement.Action.push(this.selectedItems[i].itemName)
	  	}
	}
  	newStatement.Effect = this.newPolicy.effect
  	newStatement.Resource = "arn:aws:s3:::"+this.newPolicy.bucket
  	console.log(newStatement)

  	this.newPolicyRaw.Statement.push(newStatement);
  	console.log(this.newPolicyRaw)

  	this.resetPloicyForm(false);

  }

  private removeStatement(i){
  	this.newPolicyRaw.Statement.splice(i,1)
  }

  private createPolicy(){
  	console.log(this.newPolicy, this.newPolicyRaw)

  	let policyString = JSON.stringify(this.newPolicyRaw);
  	console.log(">>>>>>>",policyString)

  	this.apiService.addPolicy(this.newPolicy.name,policyString).subscribe((data)=>{
      console.log(data);
      this.getPolicies();
    });
  }

}
