<template>
  <div class="space-y-6">
    <!-- Main Form Card -->
    <div class="card">
      <form class="space-y-6">
        <!-- Mode Setting -->
        <div class="form-group">
          <label class="form-label">模式设置</label>
          <div class="flex space-x-4">
            <label class="flex items-center cursor-pointer">
              <input
                v-model="advanced"
                value="1"
                type="radio"
                class="sr-only"
              />
              <div class="radio-button" :class="{ active: advanced === '1' }">
                基础模式
              </div>
            </label>
            <label class="flex items-center cursor-pointer">
              <input
                v-model="advanced"
                value="2"
                type="radio"
                class="sr-only"
              />
              <div class="radio-button" :class="{ active: advanced === '2' }">
                进阶模式
              </div>
            </label>
          </div>
        </div>
        <!-- Subscription URL -->
        <div class="form-group">
          <label class="form-label">订阅链接</label>
          <textarea
            v-model="form.sourceSubUrl"
            rows="3"
            class="input-field w-full"
            placeholder="支持订阅或ss/ssr/vmess链接，多个链接每行一个或用 | 分隔"
            @blur="saveSubUrl"
          ></textarea>
        </div>
        <!-- Client Type -->
        <div class="form-group">
          <label class="form-label">客户端</label>
          <select v-model="form.clientType" class="input-field w-full">
            <option v-for="(v, k) in options.clientTypes" :key="k" :value="v">
              {{ k }}
            </option>
          </select>
        </div>

        <!-- Filter Template (Basic Mode) -->
        <div class="form-group">
          <label class="form-label">节点过滤(按国家代码)</label>
          <select
            v-model="selectedFilterTemplate"
            @change="applyFilterTemplate"
            class="input-field w-full"
          >
            <option value="">全部节点</option>
            <option v-for="(_, key) in filterTemplates" :key="key" :value="key">
              {{ getTemplateLabel(key) }}
            </option>
          </select>
        </div>

        <!-- Advanced Mode -->
        <div
          v-if="advanced === '2'"
          class="space-y-6 pt-6 border-t border-theme"
        >
          <div class="form-group">
            <label class="form-label">远程配置</label>
            <div class="flex flex-col sm:flex-row gap-2">
              <select
                v-model="form.remoteConfig"
                class="input-field flex-1 sm:rounded-r-none"
              >
                <option value="">请选择远程配置</option>
                <optgroup
                  v-for="group in options.remoteConfig"
                  :key="group.label"
                  :label="group.label"
                >
                  <option
                    v-for="item in group.options"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </option>
                </optgroup>
              </select>
              <button
                @click="gotoRemoteConfig"
                type="button"
                class="btn-secondary sm:rounded-l-none sm:border-l-0 flex items-center justify-center space-x-2 whitespace-nowrap"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span>配置示例</span>
              </button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Backend 定制</label>
            <div class="flex flex-col sm:flex-row gap-2">
              <input
                v-model="form.customBackend"
                :readonly="!form.useCustomBackend"
                class="input-field flex-1 sm:rounded-r-none"
                :class="{
                  'bg-theme-input text-theme-placeholder':
                    !form.useCustomBackend,
                }"
                placeholder="Backend 地址"
              />
              <button
                @click="form.useCustomBackend = !form.useCustomBackend"
                type="button"
                class="sm:rounded-l-none sm:border-l-0 flex items-center justify-center space-x-2 whitespace-nowrap"
                :class="form.useCustomBackend ? 'btn-primary' : 'btn-secondary'"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span>{{ form.useCustomBackend ? "使用默认" : "自定义" }}</span>
              </button>
            </div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="form-group">
              <label class="form-label">过滤指定节点</label>
              <input
                v-model="form.includeRemarks"
                class="input-field w-full"
                placeholder="节点名包含的关键字，支持正则"
              />
            </div>
            <div class="form-group">
              <label class="form-label">移除指定节点</label>
              <input
                v-model="form.excludeRemarks"
                class="input-field w-full"
                placeholder="节点名不包含的关键字，支持正则"
              />
            </div>
            <div class="form-group">
              <label class="form-label">订阅文件名</label>
              <input
                v-model="form.filename"
                class="input-field w-full"
                placeholder="返回的订阅文件名"
              />
            </div>
          </div>

          <!-- Custom Parameters -->
          <div v-if="customParams.length > 0" class="space-y-4">
            <h4 class="text-sm font-medium text-theme-muted">自定义参数</h4>
            <div
              v-for="(param, i) in customParams"
              :key="i"
              class="flex space-x-3"
            >
              <input
                v-model="param.name"
                class="input-field flex-1"
                placeholder="参数名"
              />
              <span class="flex items-center text-theme-secondary">:</span>
              <input
                v-model="param.value"
                class="input-field flex-1"
                placeholder="参数值"
              />
              <button
                @click="customParams.splice(i, 1)"
                type="button"
                class="text-red-400 hover:text-red-300 p-2"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Options Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <!-- Node List Option -->
            <div
              class="bg-theme-elevated rounded-lg shadow-lg border border-theme p-4"
            >
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  v-model="form.nodeList"
                  type="checkbox"
                  class="checkbox"
                />
                <span class="text-sm font-medium text-theme-muted"
                  >输出为 Node List</span
                >
              </label>
            </div>

            <!-- Basic Options -->
            <div
              class="bg-theme-elevated rounded-lg shadow-lg border border-theme p-4"
            >
              <h4 class="text-sm font-medium text-theme-muted mb-3">
                基础选项
              </h4>
              <div class="space-y-2">
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="form.emoji"
                    type="checkbox"
                    class="checkbox"
                  />
                  <span class="text-sm text-theme-secondary">Emoji</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input v-model="form.scv" type="checkbox" class="checkbox" />
                  <span class="text-sm text-theme-secondary">跳过证书验证</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="form.udp"
                    @change="needUdp = true"
                    type="checkbox"
                    class="checkbox"
                  />
                  <span class="text-sm text-theme-secondary">启用 UDP</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="form.appendType"
                    type="checkbox"
                    class="checkbox"
                  />
                  <span class="text-sm text-theme-secondary">节点类型</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input v-model="form.sort" type="checkbox" class="checkbox" />
                  <span class="text-sm text-theme-secondary">排序节点</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input v-model="form.fdn" type="checkbox" class="checkbox" />
                  <span class="text-sm text-theme-secondary">过滤非法节点</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="form.expand"
                    type="checkbox"
                    class="checkbox"
                  />
                  <span class="text-sm text-theme-secondary">规则展开</span>
                </label>
              </div>
            </div>

            <!-- Custom Features -->
            <div
              class="bg-theme-elevated rounded-lg shadow-lg border border-theme p-4"
            >
              <h4 class="text-sm font-medium text-theme-muted mb-3">
                定制功能
              </h4>
              <div class="space-y-2">
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="form.tpl.surge.doh"
                    type="checkbox"
                    class="checkbox"
                  />
                  <span class="text-sm text-theme-secondary">Surge.DoH</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="form.tpl.clash.doh"
                    type="checkbox"
                    class="checkbox"
                  />
                  <span class="text-sm text-theme-secondary">Clash.DoH</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="form.insert"
                    type="checkbox"
                    class="checkbox"
                  />
                  <span class="text-sm text-theme-secondary">网易云</span>
                </label>
              </div>
              <div class="mt-4 flex space-x-2">
                <button
                  @click="addCustomParam"
                  type="button"
                  class="btn-secondary text-xs px-3 py-1 flex items-center space-x-1"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span>添加参数</span>
                </button>
                <a
                  :href="subDocAdvanced"
                  target="_blank"
                  class="btn-secondary text-xs px-3 py-1 flex items-center space-x-1"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span>文档</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Results Section -->
    <div class="card">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-theme-primary mb-2">生成结果</h3>
        <p class="text-theme-secondary text-sm">生成的订阅链接和短链接</p>
      </div>

      <div class="space-y-4">
        <!-- Custom Subscription URL -->
        <div class="form-group">
          <label class="form-label">定制订阅</label>
          <div class="flex">
            <input
              v-model="customSubUrl"
              readonly
              class="input-field flex-1 rounded-r-none bg-theme-input text-theme-placeholder"
              placeholder="点击生成订阅链接"
            />
            <button
              v-clipboard:copy="customSubUrl"
              v-clipboard:success="onCopy"
              type="button"
              class="btn-primary rounded-l-none border-l-0 flex items-center space-x-2"
              :disabled="!customSubUrl"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                <path
                  d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"
                ></path>
              </svg>
              <span>复制</span>
            </button>
          </div>
        </div>

        <!-- Short URL -->
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 space-y-4">
        <!-- Primary Actions -->
        <div class="flex flex-wrap gap-4 justify-center">
          <button
            @click="makeUrl"
            type="button"
            class="btn-primary px-6 py-3 min-w-[140px] flex items-center justify-center space-x-2"
            :disabled="form.sourceSubUrl.length === 0"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span>生成订阅链接</span>
          </button>

          <button
            @click="clashInstall"
            type="button"
            class="btn-secondary px-6 py-3 min-w-[140px] flex items-center justify-center space-x-2"
            :disabled="customSubUrl.length === 0"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span>一键导入 Clash</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Upload Config Modal -->
    <div
      v-if="dialogUploadConfigVisible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
    >
      <div class="card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <h3 class="text-lg font-semibold text-white">
              Remote config upload
            </h3>
            <a
              :href="sampleConfig"
              target="_blank"
              class="text-primary-400 hover:text-primary-300 text-sm flex items-center space-x-1"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span>参考配置</span>
            </a>
          </div>
          <button
            @click="
              uploadConfig = '';
              dialogUploadConfigVisible = false;
            "
            class="text-theme-secondary hover:text-theme-primary"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div class="mb-6">
          <textarea
            v-model="uploadConfig"
            rows="15"
            maxlength="10000"
            class="input-field w-full resize-none"
            placeholder="请输入远程配置内容..."
          ></textarea>
          <div class="text-right text-sm text-theme-secondary mt-2">
            {{ uploadConfig.length }}/10000
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="
              uploadConfig = '';
              dialogUploadConfigVisible = false;
            "
            type="button"
            class="btn-secondary px-6 py-2"
          >
            取消
          </button>
          <button
            @click="confirmUploadConfig"
            type="button"
            class="btn-primary px-6 py-2"
            :disabled="uploadConfig.length === 0"
          >
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-12 py-6 border-t border-theme">
      <div class="text-center text-theme-secondary text-sm">
        <p>
          广告由 Google 提供, 用于覆盖服务器费用
          <span class="text-theme-primary font-medium">
            (风险内容请自行鉴别)
          </span>
        </p>
        <p class="mt-1">
          Backend
          <a
            href="https://github.com/tindy2013/subconverter"
            target="_blank"
            class="text-primary-400 hover:text-primary-300 transition-colors"
            >Subconverter
          </a>

          by tindy2013 || Frontend Code by
          <span class="text-theme-primary font-medium">Rarako</span>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, getCurrentInstance } from "vue";

// Environment variables
const remoteConfigSample = import.meta.env.VITE_APP_SUBCONVERTER_REMOTE_CONFIG;
const subDocAdvanced = import.meta.env.VITE_APP_SUBCONVERTER_DOC_ADVANCED;
const defaultBackend =
  import.meta.env.VITE_APP_SUBCONVERTER_DEFAULT_BACKEND + "/sub?";
const nextBackend =
  import.meta.env.VITE_APP_SUBCONVERTER_NEXT_BACKEND + "/sub?";
const configUploadBackend = import.meta.env.VITE_APP_CONFIG_UPLOAD_API;

// Get global properties
const { proxy } = getCurrentInstance();

// Reactive data
const advanced = ref("2");

const options = reactive({
  clientTypes: {
    ClashMeta: "clash-meta",
    Clash: "clash",
    Ninja: "ninja",
    Surge: "surge&ver=4",
    Quantumult: "quan",
    QuantumultX: "quanx",
    Mellow: "mellow",
    Surfboard: "surfboard",
    Loon: "loon",
    singbox: "singbox",
    ss: "ss",
    ssd: "ssd",
    sssub: "sssub",
    ssr: "ssr",
    V2Ray: "v2ray",
    Trojan: "trojan",
    Surge3: "surge&ver=3",
  },
  remoteConfig: [
    {
      label: "推荐",
      options: [
        {
          label: "极简配置",
          value:
            "https://raw.githubusercontent.com/9bingyin/routes-info/refs/heads/main/profile_min.ini",
        },
        {
          label: "ACL4 通用",
          value:
            "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online.ini",
        },
      ],
    },
    {
      label: "标准通用",
      options: [
        {
          label: "No-Urltest",
          value:
            "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/universal/no-urltest.ini",
        },
        {
          label: "Urltest",
          value:
            "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/universal/urltest.ini",
        },
      ],
    },
    {
      label: "ACL规则",
      options: [
        {
          label: "ACL_默认版",
          value:
            "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online.ini",
        },
        {
          label: "ACL_无测速版",
          value:
            "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoAuto.ini",
        },
        {
          label: "ACL_去广告版",
          value:
            "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_AdblockPlus.ini",
        },
        {
          label: "ACL_多国家版",
          value:
            "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_MultiCountry.ini",
        },
        {
          label: "ACL_无Reject版",
          value:
            "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoReject.ini",
        },
        {
          label: "ACL_无测速精简版",
          value:
            "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_NoAuto.ini",
        },
        {
          label: "ACL_全分组版",
          value:
            "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full.ini",
        },
        {
          label: "ACL_全分组谷歌版",
          value:
            "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_Google.ini",
        },
        {
          label: "ACL_全分组多模式版",
          value:
            "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_MultiMode.ini",
        },
        {
          label: "ACL_全分组奈飞版",
          value:
            "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_Netflix.ini",
        },
        {
          label: "ACL_精简版",
          value:
            "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini.ini",
        },
        {
          label: "ACL_去广告精简版",
          value:
            "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_AdblockPlus.ini",
        },
        {
          label: "ACL_Fallback精简版",
          value:
            "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_Fallback.ini",
        },
        {
          label: "ACL_多国家精简版",
          value:
            "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiCountry.ini",
        },
        {
          label: "ACL_多模式精简版",
          value:
            "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiMode.ini",
        },
      ],
    },
    {
      label: "MK 通用",
      options: [
        {
          label: "默认",
          value:
            "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_NoAuto.ini",
        },
        {
          label: "默认（自动测速）",
          value:
            "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_AdblockPlus.ini",
        },
        {
          label: "默认（索尼电视专用）",
          value:
            "https://raw.githubusercontent.com/youshandefeiyang/webcdn/main/SONY.ini",
        },
        {
          label: "默认（附带用于 Clash 的 AdGuard DNS）",
          value:
            "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/default_with_clash_adg.yml",
        },
        {
          label: "ACL_全分组 Dream修改版",
          value:
            "https://raw.githubusercontent.com/WC-Dream/ACL4SSR/WD/Clash/config/ACL4SSR_Online_Full_Dream.ini",
        },
        {
          label: "ACL_精简分组 Dream修改版",
          value:
            "https://raw.githubusercontent.com/WC-Dream/ACL4SSR/WD/Clash/config/ACL4SSR_Mini_Dream.ini",
        },
        {
          label: "emby-TikTok-流媒体分组-去广告加强版",
          value:
            "https://raw.githubusercontent.com/justdoiting/ClashRule/main/GeneralClashRule.ini",
        },
        {
          label: "流媒体通用分组",
          value:
            "https://raw.githubusercontent.com/cutethotw/ClashRule/main/GeneralClashRule.ini",
        },
      ],
    },
    {
      label: "Special",
      options: [
        {
          label: "NeteaseUnblock(仅规则，No-Urltest)",
          value:
            "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/special/netease.ini",
        },
        {
          label: "Basic(仅GEOIP CN + Final)",
          value:
            "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/special/basic.ini",
        },
      ],
    },
  ],
});

const form = reactive({
  sourceSubUrl: "",
  clientType: "",
  remoteConfig: "",
  excludeRemarks: "",
  includeRemarks: "",
  filename: "",
  emoji: true,
  nodeList: false,
  sort: false,
  udp: true,
  scv: true,
  fdn: false,
  expand: true,
  appendType: false,
  insert: false,
  new_name: true,
  useCustomBackend: false,
  customBackend: "",
  tpl: {
    surge: {
      doh: false,
    },
    clash: {
      doh: false,
    },
  },
});

const customParams = ref([]);
const selectedFilterTemplate = ref("");
const filterTemplates = reactive({
  asia: /\s(?:HK|MO|TW|SG|MY|MV|KH|TH|MM|LA|VN|JP|KR|BT|BN|PH|ID|IN|MN|JO|IR|BH|OM|IL|PS|TR|NP|BD|LB|IQ|SY|AF|QA|KW|AE|AZ|AM|GE|PK|LK|SA|KZ|TJ|KG|UZ)$/,
  americas:
    /\s(?:US|CA|PM|MX|PA|BM|GL|GD|CR|VG|VI|BR|CL|PE|CU|HT|AR|UY|PY|JM|SR|BS|GF|BZ|MS|AW|CW|SX|MF|BL|GP|MQ|AG|KN|TT|VC|CO|EC|VE|BO|GT|SV|PR|KY|HN|DM|BB|LC|FK|TC)$/,
  europe:
    /\s(?:FR|GB|GG|JE|DE|DK|NO|SE|FI|IS|CH|CZ|GR|NL|PL|ME|RU|UA|HU|LU|AT|IT|VA|BE|IE|LT|ES|PT|AD|MT|MC|BG|HR|MK|RS|CY|LV|MD|SK|EE|BY|RO|GI|SM|FO|AX|SI|AL|BA|LI)$/,
  africa:
    /\s(?:EG|GH|TG|ZA|BJ|SD|ML|CG|GA|TD|TN|LY|KE|RW|CV|AO|CM|BI|SO|DJ|GM|GN|LS|MW|NE|UG|YT|ZM|NG|MZ|MU|CI|TZ|ZW|SN|BW|NA|SL|SZ|LR|DZ|MG|GQ|BF|ER|ET|MR|CF|ST|RE)$/,
  hk_tw_sg_jp_us: /\s(?:HK|TW|SG|JP|US)$/,
  game: /游戏/,
});

const loading = ref(false);
const customSubUrl = ref("");
const dialogUploadConfigVisible = ref(false);
const uploadConfig = ref("");
const sampleConfig = remoteConfigSample;
const needUdp = ref(false);

// Functions
const onCopy = () => {
  proxy.$message.success("Copied!");
};

const gotoRemoteConfig = () => {
  window.open(remoteConfigSample);
};

const clashInstall = () => {
  if (customSubUrl.value === "") {
    proxy.$message.error("请先填写必填项，生成订阅链接");
    return false;
  }

  const url = "clash://install-config?url=";
  window.open(url + encodeURIComponent(customSubUrl.value));
};

const addCustomParam = () => {
  customParams.value.push({
    name: "",
    value: "",
  });
};

const makeUrl = () => {
  if (form.sourceSubUrl === "" || form.clientType === "") {
    proxy.$message.error("订阅链接与客户端为必填项");
    return false;
  }

  // Select backend based on custom backend or client type
  let backend;
  if (form.useCustomBackend && form.customBackend) {
    // Use custom backend if enabled (ignore ninja logic)
    backend = form.customBackend.endsWith("/sub?")
      ? form.customBackend
      : form.customBackend + "/sub?";
  } else {
    // Use default logic: ninja uses nextBackend, others use defaultBackend
    backend = form.clientType === "ninja" ? nextBackend : defaultBackend;
  }
  let sourceSub = form.sourceSubUrl;
  sourceSub = sourceSub.replace(/(\n|\r|\n\r)/g, "|");

  let isMeta = false;
  let targetClientType = form.clientType;
  if (form.clientType === "clash-meta") {
    // 使用临时变量，不修改 form.clientType
    targetClientType = "clash";
    isMeta = true;
  }

  customSubUrl.value =
    backend +
    "target=" +
    targetClientType +
    "&url=" +
    encodeURIComponent(sourceSub) +
    "&insert=" +
    form.insert;

  if (form.includeRemarks) {
    customSubUrl.value += "&include=" + encodeURIComponent(form.includeRemarks);
  }

  if (isMeta) {
    customSubUrl.value += "&clash.meta=true";
  }
  if (advanced.value === "2") {
    if (form.remoteConfig) {
      customSubUrl.value += "&config=" + encodeURIComponent(form.remoteConfig);
    }
    if (form.excludeRemarks) {
      customSubUrl.value +=
        "&exclude=" + encodeURIComponent(form.excludeRemarks);
    }
    if (form.filename) {
      customSubUrl.value += "&filename=" + encodeURIComponent(form.filename);
    }
    if (form.appendType) {
      customSubUrl.value += "&append_type=" + form.appendType.toString();
    }

    customSubUrl.value +=
      "&emoji=" +
      form.emoji.toString() +
      "&list=" +
      form.nodeList.toString() +
      "&scv=" +
      form.scv.toString() +
      "&fdn=" +
      form.fdn.toString() +
      "&expand=" +
      form.expand.toString() +
      "&sort=" +
      form.sort.toString();

    if (needUdp.value) {
      customSubUrl.value += "&udp=" + form.udp.toString();
    }

    if (form.tpl.surge.doh === true) {
      customSubUrl.value += "&surge.doh=true";
    }

    if (form.clientType === "clash" || form.clientType === "clash-meta") {
      if (form.tpl.clash.doh === true) {
        customSubUrl.value += "&clash.doh=true";
      }
      customSubUrl.value += "&new_name=" + form.new_name.toString();
    }

    customParams.value
      .filter((param) => param.name && param.value)
      .forEach((param) => {
        customSubUrl.value += `&${encodeURIComponent(
          param.name
        )}=${encodeURIComponent(param.value)}`;
      });
  }

  proxy.$copyText(customSubUrl.value);
  proxy.$message.success("定制订阅已复制到剪贴板");
};

const confirmUploadConfig = () => {
  if (uploadConfig.value === "") {
    proxy.$message.warning("远程配置不能为空");
    return false;
  }

  loading.value = true;

  const body = {
    content: uploadConfig.value,
  };

  proxy.$axios
    .post(configUploadBackend, body)
    .then((res) => {
      if (res.data.code === 0 && res.data.data.url !== "") {
        proxy.$message.success(
          "远程配置上传成功，配置链接已复制到剪贴板，有效期三个月望知悉"
        );
        form.remoteConfig = res.data.data.url;
        proxy.$copyText(form.remoteConfig);
        dialogUploadConfigVisible.value = false;
      } else {
        proxy.$message.error("远程配置上传失败: " + res.data.msg);
      }
    })
    .catch(() => {
      proxy.$message.error("远程配置上传失败");
    })
    .finally(() => {
      loading.value = false;
    });
};

const saveSubUrl = () => {
  if (form.sourceSubUrl !== "") {
    setLocalStorageItem("sourceSubUrl", form.sourceSubUrl);
  }
};

const saveClientType = () => {
  if (form.clientType !== "") {
    setLocalStorageItem("clientType", form.clientType);
  }
};

const getLocalStorageItem = (itemKey) => {
  const now = +new Date();
  let ls = localStorage.getItem(itemKey);

  let itemValue = "";
  if (ls !== null) {
    let data = JSON.parse(ls);
    if (data.expire > now) {
      itemValue = data.value;
    } else {
      localStorage.removeItem(itemKey);
    }
  }

  return itemValue;
};

const setLocalStorageItem = (itemKey, itemValue) => {
  const ttl = import.meta.env.VITE_APP_CACHE_TTL;
  const now = +new Date();

  let data = {
    setTime: now,
    ttl: parseInt(ttl),
    expire: now + ttl * 1000,
    value: itemValue,
  };
  localStorage.setItem(itemKey, JSON.stringify(data));
};

const getTemplateLabel = (key) => {
  const labels = {
    hk_tw_sg_jp_us: "常用节点 (HK/TW/SG/JP/US)",
    asia: "亚洲节点",
    americas: "美洲节点",
    europe: "欧洲节点",
    africa: "非洲节点",
    game: "游戏节点",
  };
  return labels[key] || key;
};

const applyFilterTemplate = () => {
  if (
    selectedFilterTemplate.value &&
    filterTemplates[selectedFilterTemplate.value]
  ) {
    form.includeRemarks = filterTemplates[selectedFilterTemplate.value].source;
  }
};

// Lifecycle
document.title = "Subscription Converter";

// Load cached URL on component setup
if (import.meta.env.VITE_APP_USE_STORAGE === "true") {
  form.sourceSubUrl = getLocalStorageItem("sourceSubUrl");
}

// Watch clientType changes and save to localStorage
watch(
  () => form.clientType,
  (newValue) => {
    if (newValue && import.meta.env.VITE_APP_USE_STORAGE === "true") {
      saveClientType();
    }
    // Update customBackend display when clientType changes (if not using custom backend)
    if (!form.useCustomBackend) {
      const currentBackend =
        newValue === "ninja" ? nextBackend : defaultBackend;
      form.customBackend = currentBackend.replace("/sub?", "");
    }
  }
);

onMounted(() => {
  // Load clientType from localStorage if available, otherwise use default
  if (import.meta.env.VITE_APP_USE_STORAGE === "true") {
    const savedClientType = getLocalStorageItem("clientType");
    form.clientType = savedClientType || "clash-meta";
  } else {
    form.clientType = "clash-meta";
  }

  // Initialize customBackend with current backend based on clientType
  // Remove "/sub?" suffix for display, it will be added when generating URL
  const initialBackend =
    form.clientType === "ninja" ? nextBackend : defaultBackend;
  form.customBackend = initialBackend.replace("/sub?", "");

  // Check for 'link' parameter in URL and auto-fill sourceSubUrl
  const urlParams = new URLSearchParams(window.location.search);
  const linkParam = urlParams.get("link");

  if (linkParam) {
    try {
      const decodedLink = decodeURIComponent(linkParam);
      form.sourceSubUrl = decodedLink;
      // Save to localStorage if storage is enabled
      if (import.meta.env.VITE_APP_USE_STORAGE === "true") {
        setLocalStorageItem("sourceSubUrl", decodedLink);
      }
    } catch (error) {
      console.warn("Failed to decode link parameter:", error);
    }
  }
});
</script>
