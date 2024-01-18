<template>
  <div>
    <h1>课程管理</h1>
    <table>
      <thead>
        <tr>
          <th>课程名称</th>
          <th>操作</th> <!-- 为考勤按钮添加列 -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="courseItem in courses" :key="courseItem.name">
          <td>{{ courseItem.name }}</td> <!-- 显示课程名称 -->
          <td><button @click="checkClass(courseItem.id)">查看教学班</button></td>
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
      courses: [], // 存储课程信息
      teacherId: '' // 存储 teacherId 的属性
    }
  },
  created() {
    this.teacherId = this.$route.query.teacherId
    this.fetchCourses()
  },
  methods: {
    fetchCourses() {
      axios.get(`http://localhost:8088/teacherrole/course`, { params: { tid: this.teacherId }})
        .then(response => {
          if (response.data && response.data.data) {
            this.courses = response.data.data
          } else {
            console.error('获取课程失败: 无有效数据')
          }
        })
        .catch(error => {
          console.error('获取课程失败:', error)
        })
    },
    checkClass(courseId) {
      console.log('检查课程编号：', courseId)
      this.$router.push({ path: `/attendance`, query: { courseId: courseId }})
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

