<template>
  <div>
    <h1>考勤记录</h1>
    <table>
      <thead>
        <tr>
          <th>考勤记录编号</th>
          <th>考勤日期</th>
          <th>操作</th> <!-- 新增操作列 -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in history" :key="index">
          <td>{{ item.id }}</td> <!-- 显示考勤记录编号 -->
          <td>{{ item.date }}</td> <!-- 显示考勤日期 -->
          <td>
            <button @click="checkAttendance(item.id)">查看详情</button>
          </td>
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
      class_id: '', // 班级名称
      history: []
    }
  },
  created() {
    this.class_id = this.$route.query.classId
    this.initHistory()
  },

  methods: {
    async initHistory() {
      const res = await axios.get(`http://localhost:8088/attendance/findAttendance?clid=${this.class_id}`)
      console.log(res)
      if (res.data.code === '200') {
        this.history = res.data.data.records
      }
    },
    checkAttendance(history) {
      this.$router.push({ path: `/studentrecord`, query: { history }})
      console.log(this.history)
    }
  }
}
</script>

<style>

h1 {
    text-align: center
}

table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

th, td {
  border-bottom: 1px solid #ddd;
  padding: 12px 15px;
  text-align: left;
  font-size: 16px;
}

th {
  background-color: #4CAF50;
  color: white;
}

tbody tr:nth-child(odd) {
  background-color: #f2f2f2;
}

tbody tr:hover {
  background-color: #ddd;
  transition: background-color 0.3s ease;
}

button {
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}
</style>
