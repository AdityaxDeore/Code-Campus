let c=[];const a=async(s,t,e="")=>{const n={_id:"local_"+Date.now(),...s,teacherId:t,teacherName:e,createdAt:new Date().toISOString()};return c.push(n),{success:!0,id:n._id,assignment:n}},u=async(s={})=>{let t=[...c];return s.subject&&s.subject!=="all"&&(t=t.filter(e=>e.subject===s.subject)),{success:!0,assignments:t}};export{a as c,u as g};
//# sourceMappingURL=assignmentService-fREIcGj2.js.map
