<template>
  <div style="border: 1px solid #ccc;">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editorId="editorId"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 500px; overflow-y: hidden;"
      :editorId="editorId"
      :defaultConfig="editorConfig"
      :defaultHtml="defaultHtml"
      :mode="mode"
      @onChange="onChange"
    />
    <!-- :defaultContent="getDefaultContent" -->
    <!-- 注意： defaultContent （JSON 格式） 和 defaultHtml （HTML 格式），二选一 -->
  </div>
</template>

<script>

// import '@wangeditor/editor/dist/css/style.css'
// eslint-disable-next-line no-unused-vars
import { Editor, Toolbar, getEditor, removeEditor } from '@wangeditor/editor-for-vue'


export default {
  name: 'AppEditor',
  components: { Editor, Toolbar },
  props: {
    msg: String
  },
  data() {
    return {
      editorId: `w-e-${Math.random().toString().slice(-5)}`, //【注意】编辑器 id ，要全局唯一
      toolbarConfig: {
        insertKeys: {
          index: 0, // 自定义插入的位置
          keys: ['uploadAttachment'], // “上传附件”菜单
        },
      },
      editorConfig: {
        placeholder: '请输入内容...',
        hoverbarKeys: {
          attachment: {
            menuKeys: ['downloadAttachment'], // “下载附件”菜单
          },
        },
        MENU_CONF: {
          uploadImage: {
            server: 'http://localhost:8080/f/upload/img',
            fieldName: 'file',

            customInsert(result, insertFn) {
              // res 即服务端的返回结果
              if (result.flag == false) {
                throw new Error(result.msg)
              }
              // 从 res 中找到 url alt href ，然后插图图片
              insertFn(result.data.url, result.data.filename, result.data.url)
            },
            // 小于该值就插入 base64 格式（而不上传），默认为 0
            base64LimitSize: 5 * 1024, // 5kb
            // 单个文件的最大体积限制，默认为 2M
            maxFileSize: 3 * 1024 * 1024,
          },
          uploadVideo: {
            server: 'http://localhost:8080/f/upload/video',
            fieldName: 'file',
            maxFileSize: 100 * 1024 * 1024, // 100M
            // 自定义插入视频
            customInsert(result, insertFn) {
              // res 即服务端的返回结果
              if (result.flag == false) {
                throw new Error(result.msg)
              }

              // 从 res 中找到 url ，然后插入视频
              insertFn(result.data.url)
            },
          },
          // “上传附件”菜单的配置
          uploadAttachment: {
            server: 'http://localhost:8080/f/upload/attr',
            fieldName: 'file',
            maxFileSize: 10 * 1024 * 1024, // 10M
            // 上传成功后，用户自定义插入文件
            customInsert(result, file, insertFn) {

              // res 即服务端的返回结果
              if (result.flag == false) {
                throw new Error(result.msg)
              }
              const { url } = result.data || {}
              if (!url) throw new Error(`url is empty`)

              // 插入附件到编辑器
              insertFn(`附件-${file.name}`, url)
            },
          }

        },

      },
      mode: 'default', // or 'simple'

      defaultHtml: '<p>hello</p>',
      latestContent: '',
    }
  },
  methods: {
    onChange(editor) {
      console.log('onChange', editor.children) // onChange 时获取编辑器最新内容
      console.log('onChange', editor.getHtml()) 
      this.latestContent = editor.children

    },
  },

  beforeDestroy() {
    const editor = getEditor(this.editorId)
    if (editor == null) return

    // 【注意】组件销毁时，及时销毁编辑器
    editor.destroy()
    removeEditor(this.editorId)
  }
}
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>
