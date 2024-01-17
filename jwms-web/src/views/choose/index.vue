<template>
  <div>
    <h1>课程管理</h1>
    <!-- 搜索和添加课程部分 -->
    <div>
      <input v-model="searchQuery" placeholder="搜索课程">
      <button @click="searchCourses">搜索</button>
    </div>
    <!-- 模态弹框，用于学生选课程 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <table>
          <thead>
            <tr>
              <th>教学班编号</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for=" class1 in classes" :key=" class1 ">
              <td>{{ class1 }}</td>
              <td v-if="classSelectionStatus[class1]">
                <button @click="Choose(class1)">选课</button>
              </td>
              <td v-else>
                <button @click="disChoose(class1)">退课</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="modal-button-container">
          <button @click="closeModal">取消</button>
        </div>
      </div>
    </div>
    <!-- 课程表格 -->
    <table>
      <thead>
        <tr>
          <th>课程编号</th>
          <th>课程名称</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in paginatedCourses" :key="course.id">
          <td>{{ course.id }}</td>
          <td>{{ course.name }}</td>
          <td>
            <button @click="chooseCourse(course)">选择教学班</button>
          </td>
        </tr>
      </tbody>
    </table>
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
      studentId: '',
      courses: [],
      searchQuery: '',
      currentPage: 1,
      pageSize: 20,
      totalPagesFromBackend: 0,
      showModal: false,
      modalTitle: '',
      modalButtonLabel: '',
      selectedCourseClasses: [],
      selectedCourseId: null,
      classes: [],
      calssstudents: [],
      classSelectionStatus: {}
    }
  },
  computed: {
    totalPages() {
      return this.totalPagesFromBackend
    },
    paginatedCourses() {
      return this.courses
    }
  },
  mounted() {
    this.studentId = this.$route.query.studentId
    console.log(this.studentId)
    this.fetchCourses()
  },
  methods: {
    async updateClassSelectionStatus() {
      for (const classId of this.classes) {
        const isSelected = await this.checkStudentClass(classId)
        this.$set(this.classSelectionStatus, classId, isSelected)
      }
    },
    async Choose(classId) {
      try {
        const response = await axios.post('http://localhost:8088/classstudent', {
          sid: this.studentId,
          clid: classId
        })
        console.log('选课成功:', response)
        this.classSelectionStatus[classId] = true
        this.closeModal()
      } catch (error) {
        console.error('选课失败:', error)
      }
    },

    async disChoose(classId) {
      console.log(this.studentId, classId)
      try {
        const response = await axios.delete('http://localhost:8088/classstudent/delete', {
          data: {
            sid: this.studentId,
            clid: classId
          }
        })

        console.log('退课成功:', response)
        this.classSelectionStatus[classId] = false
        this.closeModal()
      } catch (error) {
        console.error('退课失败:', error)
      }
    },

    closeModal() {
      this.showModal = false
      this.classes = []
    },
    fetchCourses() {
      axios.get('http://localhost:8088/course/page', {
        params: { pageNum: this.currentPage, pageSize: this.pageSize }
      })
        .then(response => {
          this.courses = response.data.data.records
          this.totalPagesFromBackend = response.data.data.pages
        })
        .catch(error => {
          console.error('获取课程数据失败', error)
        })
    },
    fetchData(pageNum, pageSize, query) {
      axios.get('http://localhost:8088/course/search', {
        params: { pageNum, pageSize, query }
      })
        .then(response => {
          this.courses = response.data.data.records
          this.totalPages = response.data.data.total
        })
        .catch(error => {
          console.error('获取课程数据失败', error)
        })
    },
    searchCourses() {
      if (this.searchQuery.trim() !== '') {
        this.currentPage = 1
        this.fetchData(this.currentPage, this.pageSize, this.searchQuery)
      } else {
        this.fetchCourses()
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.fetchCourses()
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.fetchCourses()
      }
    },
    chooseCourse(course) {
    // 实现获取课程班级信息的逻辑
    // 假设 fetchClassesForCourse 返回课程的班级信息
      this.fetchClassesForCourse(course.id).then(classes => {
        this.selectedCourseClasses = classes
        this.selectedCourseId = course.id
        console.log(this.selectedCourseId)
        this.showModal = true
      })
    },
    fetchClassesForCourse(courses) {
      return axios.get('http://localhost:8088/class/getClassByCid',
        { params: { cid: courses }
        }).then(response => {
        // 假设班级信息在响应的 data 字段的 data 字段中
        // console.log(response)
        for (let i = 0; i < response.data.data.records.length; i++) {
          this.classes.push(response.data.data.records[i].id)
        }
        this.updateClassSelectionStatus()
        // console.log(this.classes)
        this.totalPagesFromBackend = response.data.data.pages
      }).catch(error => {
        console.error('获取班级数据失败', error)
      })
    },
    async checkStudentClass(class1) {
      try {
        const response = await axios.get('http://localhost:8088/classstudent/student', {
          params: { clid: class1 }
        })
        console.log(response)
        for (let i = 0; i < response.data.data.length; i++) {
          if (this.studentId.toString() === response.data.data[i].id.toString()) {
            return false
          }
        }
        return true
      } catch (error) {
        console.error('请求出错:', error)
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

.modal input[type="tempCourse.id"], .modal input[type="tempCourse.name"] {
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

