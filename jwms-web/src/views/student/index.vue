<template>
  <div>
    <h1>学生管理</h1>
    <!-- 搜索和添加学生部分 -->
    <div>
      <input v-model="searchQuery" placeholder="搜索学生">
      <button @click="searchStudents">搜索</button>
      <button @click="addStudent">新增学生</button>
    </div>

    <!-- 模态弹框，用于新增或编辑学生 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <h2>{{ modalTitle }}</h2>
        <input v-model="tempStudent.id" placeholder="学生编号">
        <input v-model="tempStudent.name" placeholder="姓名">
        <div class="modal-button-container">
          <button @click="confirmStudentChange">{{ modalButtonLabel }}</button>
          <button @click="cancelModal">取消</button>
        </div>
      </div>
    </div>

    <!-- 学生表格 -->
    <table>
      <thead>
        <tr>
          <th />
          <th>学生编号</th>
          <th>姓名</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in paginatedStudents" :key="student.id">
          <td>
            <span />
            <input v-model="student.isSelected" type="checkbox" @change="toggleSelect(student)">
          </td>
          <td>{{ student.id }}</td>
          <td>{{ student.name }}</td>
          <td>
            <button @click="editStudent(student)">编辑</button>
            <button @click="deleteStudent(student.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 批量删除按钮 -->
    <div>
      <button class="batch-delete-button" @click="batchDelete">批量删除</button>
    </div>

    <!-- 分页 -->
    <div>
      <button :disabled="currentPage === 1" @click="previousPage">上一页</button>
      <span>第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
      <button :disabled="currentPage === totalPages" @click="nextPage">下一页</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      students: [],
      searchQuery: '',
      newStudent: { id: '', name: '' },
      currentPage: 1,
      pageSize: 20,
      totalPagesFromBackend: 0,
      showModal: false,
      modalTitle: '',
      modalButtonLabel: '',
      tempStudent: { id: '', name: '' } // 用于临时保存弹框中的数据
    }
  },

  computed: {
    totalPages() {
      return this.totalPagesFromBackend
    },
    paginatedStudents() {
      return this.students
    }
  },

  mounted() {
    this.fetchStudents()
  },
  methods: {
    addStudent() {
      // 添加学生逻辑
      this.modalTitle = '新增学生'
      this.modalButtonLabel = '添加'
      this.tempStudent = { id: '', name: '' }
      this.showModal = true
    },
    editStudent(student) {
      // 编辑学生逻辑
      this.modalTitle = '编辑学生'
      this.modalButtonLabel = '保存'
      this.tempStudent = { ...student }
      this.showModal = true
    },
    confirmStudentChange() {
      if (this.modalButtonLabel === '保存') {
        // 发送编辑学生的请求
        axios.post('http://localhost:8088/student', this.tempStudent)
          .then(response => {
            console.log('学生编辑成功', response.data)
            const index = this.students.findIndex(s => s.id === this.tempStudent.id)
            if (index !== -1) {
              this.students.splice(index, 1, { ...this.tempStudent })
            }
            this.showModal = false
          })
          .catch(error => {
            console.error('学生编辑失败', error)
          })
      } else if (this.modalButtonLabel === '添加') {
        // 发送添加新学生的请求
        axios.post('http://localhost:8088/student', this.tempStudent)
          .then(response => {
            console.log('学生添加成功', response.data)
            this.fetchStudents() // 重新获取学生列表
            this.showModal = false
          })
          .catch(error => {
            console.error('学生添加失败', error)
          })
      }
    },
    cancelModal() {
      this.showModal = false
    },
    deleteStudent(id) {
    // 发送删除学生的请求
      axios.delete(`http://localhost:8088/student/${id}`)
        .then(response => {
          console.log('学生删除成功', response.data)
          this.students = this.students.filter(student => student.id !== id)
        })
        .catch(error => {
          console.error('学生删除失败', error)
        })
    },

    batchDelete() {
      const selectedStudents = this.students.filter(student => student.isSelected)
      const selectedids = selectedStudents.map(student => student.id)
      // 发送批量删除学生的请求
      axios.post('http://localhost:8088/student/del/batch', selectedids)
        .then(response => {
          console.log('学生批量删除成功', response.data)
          this.students = this.students.filter(student => !selectedids.includes(student.id))
        })
        .catch(error => {
          console.error('学生批量删除失败', error)
        })
    },
    fetchStudents() {
      axios.get('http://localhost:8088/student/page', {
        params: { pageNum: this.currentPage, pageSize: this.pageSize }
      })
        .then(response => {
          this.students = response.data.data.records
          this.totalPagesFromBackend = response.data.data.pages
        })
        .catch(error => {
          console.error('获取学生数据失败', error)
        })
    },
    fetchData(pageNum, pageSize, query) {
      axios.get('http://localhost:8088/student/search', {
        params: { pageNum, pageSize, query }
      })
        .then(response => {
          this.students = response.data.data.records
          this.totalPages = response.data.data.total
        })
        .catch(error => {
          console.error('获取学生数据失败', error)
        })
    },

    searchStudents() {
      if (this.searchQuery.trim() !== '') {
        this.currentPage = 1
        this.fetchData(this.currentPage, this.pageSize, this.searchQuery)
      } else {
      // 当输入为空时，重置搜索并返回初始界面
        this.fetchStudents()
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.fetchStudents()
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.fetchStudents()
      }
    }
  }
}
</script>

<style>
h1 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
  color: #2c3e50;
}

body, h1, div, table, tr, th, td, input, button {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}

body {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.5;
  padding: 20px;
  background-color: #ecf0f1;
}

input[type="text"], input[type="id"] {
  padding: 10px;
  margin-right: 15px;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
}

button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px 20px;
  text-transform: uppercase;
  font-size: 0.9rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  margin: 5px 0;
}

button:hover {
  background-color: #2980b9;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #bdc3c7;
}

th {
  background-color: #e4e7ea;
  font-weight: normal;
}

.batch-delete-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
  padding: 10px 15px;
  margin-bottom: 20px;
}

.batch-delete-button:hover {
  background-color: #c0392b;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.pagination button {
  margin: 0 10px;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fff;
  margin: 10% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 40%;
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  position: relative;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 15px;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
}

.modal h2 {
  margin-bottom: 15px;
  text-align:center;
  color: #2c3e50;
  font-size: 1.5rem;
}

.modal input[type="tempStudent.id"], .modal input[type="tempStudent.name"] {
  width: calc(100% - 40px);
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
}

.modal-button-container {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.modal button {
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
  padding: 8px 15px;
}

.modal button:hover {
  background-color: #27ae60;
}

* {
  box-sizing: border-box;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

</style>

