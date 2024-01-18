<template>
  <div>
    <h1>教学班管理</h1>
    <table>
      <thead>
        <tr>
          <th>教学班编号</th>
          <th>操作</th> <!-- 为考勤按钮添加列 -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="classItem in classes" :key="classItem.id">
          <td>{{ classItem.id }}</td> <!-- 显示教学班id -->
          <td><button @click="checkClass(classItem.id)">查看考勤记录</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      classes: [], // 存储班级信息
      courseId: '', // 存储 courseId 的属性
      fId: ''
    }
  },
  created() {
    this.courseId = this.$route.query.courseId
    console.log('再次检查课程编号', this.courseId)
    this.fetchClasses()
    // this.fetchFid()
  },
  methods: {
    fetchClasses() {
      axios.get(`http://localhost:8088/class/getClassByCid`, { params: { cid: this.courseId }})
        .then(response => {
          if (response.data && response.data.data && response.data.data.records) {
            this.classes = response.data.data.records
            console.log('返回教学班id:', this.classes)
          } else {
            console.error('获取教学班失败: 无有效数据')
          }
        })
        .catch(error => {
          console.error('获取教学班失败:', error)
        })
    },
    // fetchFid() {
    //   axios.get(`http://localhost:8088/attendance/findAttendance`, { params: { clid: this.classId }})
    //     .then(response => {
    //       if (response.data && response.data.data && response.data.data.records) {
    //         this.fId = response.data.data.records
    //         console.log('返回考勤表id:', this.fId)
    //       } else {
    //         console.error('获取考勤表编号失败: 无有效数据')
    //       }
    //     })
    // },
    checkClass(classId) {
      console.log('检查考勤表编号', this.classId)
      this.$router.push({ path: `/attendancerecord`, query: { classId: classId }})
    }
  }
}
</script>

    <style>
    h1 {
      text-align: center;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); /* 添加阴影效果 */
      border-radius: 8px; /* 圆角边框 */
      overflow: hidden; /* 隐藏溢出的部分 */
      margin-bottom: 20px; /* 底部间距 */
    }

    th, td {
      border-bottom: 1px solid #ddd;
      padding: 12px 15px; /* 增加填充以改善视觉效果 */
      text-align: left;
      font-size: 16px; /* 字体大小 */
    }

    th {
      background-color: #4CAF50; /* 表头背景色 */
      color: white; /* 表头文字颜色 */
    }

    tbody tr:nth-child(odd) {
      background-color: #f2f2f2; /* 间隔行背景色 */
    }

    tbody tr:hover {
      background-color: #ddd; /* 悬停背景色 */
      transition: background-color 0.3s ease; /* 平滑过渡效果 */
    }

    button {
      cursor: pointer;
      background-color: #4CAF50; /* 按钮背景色 */
      color: white; /* 按钮文字颜色 */
      border: none; /* 无边框 */
      padding: 10px 15px; /* 按钮内边距 */
      border-radius: 5px; /* 圆角按钮 */
      transition: background-color 0.3s; /* 平滑过渡效果 */
    }

    button:hover {
      background-color: #45a049; /* 按钮悬停背景色 */
    }

      </style>

