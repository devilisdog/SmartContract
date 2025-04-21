<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

        <!-- 表格顶部菜单 -->
        <!-- 自定义按钮请使用插槽，甚至公共搜索也可以使用具名插槽渲染，参见文档 -->
        <TableHeader
            :buttons="['refresh', 'comSearch', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('order.order.quick Search Fields') })"
        ></TableHeader>

        <!-- 表格 -->
        <!-- 表格列有多种自定义渲染方式，比如自定义组件、具名插槽等，参见文档 -->
        <!-- 要使用 el-table 组件原有的属性，直接加在 Table 标签上即可 -->
        <Table ref="tableRef"></Table>

        <!-- 表单 -->
        <PopupForm />
        <el-dialog v-model="centerDialogVisible" title="手动开奖" width="700" center :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
            <div style="display: flex;align-items: center;flex-wrap: wrap;">
			<span class="text">{{match.type}} {{match.gametype}}</span>
			<div style="display: flex;margin:10px auto;justify-content: space-between;">
				
                    <span class="tou" style="background-color:deepskyblue;">{{match.remarks.Note}}注</span>
				    <span class="tou" style="background-color:red;">
					    {{match.remarks.Multiple}}倍
				    </span>
           
				<div class="touguog" style="background-color:#898fff;" >
					<span class="tou2" v-for="(item,index) in match.remarks.reachType" :key="index">
						{{item=='1单关1'?'单关':item}}
					</span>
				</div>
			</div>
		</div>
            <div style=" background-color:#f5f5f5;display: flex;justify-content: space-around;margin: auto;">
			    <text style="flex: 0.3;text-align: center;">场次</text>
			    <text style="flex: 0.5;text-align: right;">主队/客场</text>
                <text style="flex: 1;text-align: center;">比分</text>
			    <text style="flex: 0.3;">投注内容</text>
                <text style="flex: 0.3;">是否中奖</text>
			    <text style="flex: 0.3;">赛果</text>

		    </div>
            <div class="neir" v-for="(item,index) in matchlist" :key="index">
                <span style="font-size:15px;flex:0.3;text-align: center;">{{item.matchNumStr}}</span>
                <div style="display: flex;flex-flow:column;align-items: center;flex:0.9;">
				    <div>
					    <span>{{item.homeTeamAbbName}}</span>
				    </div>
				    <span style="font-size:12px;">VS</span>
				    <div>
					    <span>{{item.awayTeamAbbName}}</span>
				    </div>
			    </div>
                <div style="display: flex;flex:.8;justify-content:center;">
                    <div>
                        <div>
                        <span>全场</span>
                        <div style="display: flex;">
                        <el-input v-model="item.full_home_score" type="number" placeholder="主" min="0" step="1" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
                        <el-input v-model="item.full_away_score" type="number" placeholder="客" min="0" step="1" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
                        </div>
                    </div>
                    <div  v-if="showlan">
                        <span>半场</span>
                        <div style="display: flex;">
                        <el-input v-model="item.half_home_score" type="number" placeholder="主" min="0" step="1" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
                        <el-input v-model="item.half_away_score" type="number" placeholder="客" min="0" step="1" oninput="value=value.replace(/[^0-9]/g,'')"> </el-input>
                    </div>
                    </div>
                    </div>
                </div>
                <div style="display: flex;flex:1.2;justify-content:space-around;">
				<div style="display: flex;flex-flow: column;align-items: center;flex:1;">
					<div v-for="itemNr,indexNr in item.data" :key="indexNr"
						style="text-align: center;display: flex;align-items: center;justify-content: space-around;" :style="itemNr.isWin?'color:red;':''">
                        <div style="flex: .5;">
                            <div>{{itemNr.res}}</div>
                            <div>
                                 <el-input v-model="itemNr.rate" type="number" min="0"></el-input>
                            </div>
                        </div>
                        <div style="margin-top: 15px;">
                            <el-checkbox v-model="itemNr.iswin"  size="small" @change="changcheck(itemNr)"/>
                        </div>
					</div>
				</div>
				<div style="display: flex;flex-flow: column;flex:.6;margin-bottom:20px;text-align:center;justify-content: center;">
					<span v-if="item.Result">
						{{item.Result.home_score+':'+item.Result.away_score}}<br>
						({{item.Result.half_home_score+':'+item.Result.half_away_score}})
					</span>
					<span v-else>-/-</span>
				</div>
			    </div>
            </div>
            <div style="display: flex;justify-content: space-between;margin-bottom: 20px;">
                <span>预计最大中奖金额:{{ bonusmax }}</span>
                <span>预计最小中奖金额:{{ bonusmin }}</span>
            </div>
            <el-form-item label="派奖金额">
                <el-input v-model="pailist.winmoney" type="number" min="0" @change="inputchange"></el-input>
            </el-form-item>
        <template #footer>
        <div class="dialog-footer">
        <el-button @click="closedialog()">关闭</el-button>
        <el-button type="primary" @click="addpaitype()">
            确认
        </el-button>
        </div>
        </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref ,reactive} from 'vue'
import { useI18n } from 'vue-i18n'
import PopupForm from './popupForm.vue'
import { baTableApi } from '/@/api/common'
import { defaultOptButtons } from '/@/components/table'
import TableHeader from '/@/components/table/header/index.vue'
import Table from '/@/components/table/index.vue'
import {postpaidan}from '/@/api/backend/user/group'
import baTableClass from '/@/utils/baTable'
import { ElMessage } from 'element-plus'
import { el, fa } from 'element-plus/es/locale'

defineOptions({
    name: 'order/order',
})

const { t } = useI18n()
const tableRef = ref()
const optButtons: OptButton[] = defaultOptButtons([])
const centerDialogVisible=ref(false)
var matchlist=ref([])
var match=reactive({})
let matcharr=reactive(null)
let bonusmax=ref(0)
let bonusmin=ref(0)
let showlan=ref(false)
let pailist=reactive({
    winmoney:''
})
optButtons.push({
    render: 'tipButton',
    // name 是任意的
    name: 'layoutInfo',
    // title 是语言翻译 key
    title: '手动开奖',
    text: '',
    type: 'primary',
    icon: 'fa fa-search-plus icon',
    disabledTip: false,
    click(row, field) {
        console.log(row)
        bonusmax.value=row.bonusmax
        bonusmin.value=row.bonusmin
        match=JSON.parse(row.BetContent)
        let arr=JSON.parse(row.BetContent).Content
       if(row.Type=='0'){
        showlan.value=true
        arr.forEach((element:any,index:any) => {
        arr[index].half_home_score=""
        arr[index].half_away_score=""
        arr[index].full_home_score=""
        arr[index].full_away_score=""
        matchlist.value.push(element)
       });
       }else{
        arr.forEach((element:any,index:any) => {
         arr[index].full_home_score=""
        arr[index].full_away_score=""
            matchlist.value.push(element)
       });
       }
        matcharr=row
        centerDialogVisible.value=true
    },
    display: (row: TableRow, field: TableColumn) => {
        if(row.State=='6'){
            if(row.Type==0||row.Type==1||row.Type==2||row.Type==3||row.Type==8||row.Type==9){
                return true
            }else{
                return false
            }
        }else{
            return false
        }
        },
})
const closedialog=()=>{
    centerDialogVisible.value=false
    matchlist.value=[];
    pailist.winmoney=""

}
const changcheck=(value)=>{
console.log(value)
}
/**
 * baTable 内包含了表格的所有数据且数据具备响应性，然后通过 provide 注入给了后代组件
 */
const baTable = new baTableClass(
    new baTableApi('/admin/order.Order/'),
    {
        pk: 'order_id',
        column: [
            { type: 'selection', align: 'center', operator: false },
            { label: t('order.order.order_id'), prop: 'order_id', align: 'center', width: 70, operator: 'RANGE', sortable: 'custom' },
            { label: t('order.order.shop_id'), prop: 'shop_id', align: 'center', operator: 'RANGE', sortable: false },
            { label: t('order.order.user_id'), prop: 'user_id', align: 'center', operator: 'RANGE', sortable: false },
            { label: t('order.order.default'), prop: 'default', align: 'center', render: 'tags', operator: 'eq', sortable: false, replaceValue: { '0': t('order.order.default 0'), '1': t('order.order.default 1'), '2': t('order.order.default 2'), '3': t('order.order.default 3') } },
            { label: t('order.order.State'), prop: 'State', align: 'center', render: 'tags', operator: 'eq', sortable: false, replaceValue: { '0': t('order.order.State 0'), '1': t('order.order.State 1'), '2': t('order.order.State 2'), '3': t('order.order.State 3'), '4': t('order.order.State 4'), '5': t('order.order.State 5'), '6': t('order.order.State 6'), '7': t('order.order.State 7'), '8': t('order.order.State 8'), '9': t('order.order.State 9'), '10': t('order.order.State 10'), '11': t('order.order.State 11') } },
            { label: t('order.order.issue_code'), prop: 'issue_code', align: 'center', operatorPlaceholder: t('Fuzzy query'), operator: 'LIKE', sortable: false },
            { label: t('order.order.Note'), prop: 'Note', align: 'center', operator: 'RANGE', sortable: false },
            { label: t('order.order.BetMoney'), prop: 'BetMoney', align: 'center', operator: 'RANGE', sortable: false },
            { label: t('order.order.OrderReceivingShop_id'), prop: 'OrderReceivingShop_id', align: 'center', operator: 'RANGE', sortable: false },
            { label: t('order.order.Type'), prop: 'Type', align: 'center', render: 'tags', operator: 'eq', sortable: false, replaceValue: { '0': t('order.order.Type 0'), '1': t('order.order.Type 1'), '2': t('order.order.Type 2'), '3': t('order.order.Type 3'), '4': t('order.order.Type 4'), '5': t('order.order.Type 5'), '6': t('order.order.Type 6'), '7': t('order.order.Type 7'), '8': t('order.order.Type 8'), '9': t('order.order.Type 9'), '10': t('order.order.Type 10'), '11': t('order.order.Type 11'), '12': t('order.order.Type 12'), '13': t('order.order.Type 13') } },
            { label: t('order.order.ReturnImages'), prop: 'ReturnImages', align: 'center', render: 'images', operator: false },
            { label: t('order.order.Issue'), prop: 'Issue', align: 'center', render: 'tags', operator: 'eq', sortable: false, replaceValue: { '0': t('order.order.Issue 0'), '1': t('order.order.Issue 1'), '2': t('order.order.Issue 2') } },
            { label: t('order.order.follow_pid'), prop: 'follow_pid', align: 'center', operatorPlaceholder: t('Fuzzy query'), operator: 'LIKE', sortable: false },
            { label: t('order.order.Receivingtime'), prop: 'Receivingtime', align: 'center', render: 'datetime', operator: 'RANGE', sortable: 'custom', width: 160, timeFormat: 'yyyy-mm-dd hh:MM:ss' },
            { label: t('order.order.create_time'), prop: 'create_time', align: 'center', render: 'datetime', operator: 'RANGE', sortable: 'custom', width: 160, timeFormat: 'yyyy-mm-dd hh:MM:ss' },
            { label: t('Operate'), align: 'center', width: 100, render: 'buttons', buttons: optButtons, operator: false },
        ],
        dblClickNotEditColumn: [undefined],
        defaultOrder: { prop: 'order_id', order: 'desc' },
    },
    {
        defaultItems: { shop_id: 0, user_id: 0, default: '0', State: '0', Note: 0, BetMoney: 0, OrderAwardShop_id: 0, OrderTicketingShop_id: 0, OrderReceivingShop_id: 0, Type: '0', WinningMoney: 0, bonusmin: 0, bonusmax: 0, Issue: '0', follow_pid: 0, PayTime: null, Deadline: null, drawDeadine: null, AwardMoney: 0, Awardtime: null, Receivingtime: null, Ticketingtime: null },
    }
)

provide('baTable', baTable)

const addpaitype=(()=>{
    let id=matcharr.order_id;
    let money=pailist.winmoney
    console.log(pailist.winmoney)
    if(pailist.winmoney==""){
        ElMessage({
            message: '请输入派奖金额',
            type: 'warning',
        })
    }else{
        postpaidan({order_id:id,money:money,order_data:matchlist.value}).then((res)=>{
           if(res.code==1){
            ElMessage({
                message: res.msg,
                type: 'success',
            })
            centerDialogVisible.value=false
            matchlist.value=[]
             pailist.winmoney=""
                baTable.getIndex()?.then(() => {
                baTable.initSort()
                baTable.dragSort()
            })
           }
        })
        .catch((err)=>{
            console.log(err)
        })
    }
})
onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    baTable.getIndex()?.then(() => {
        baTable.initSort()
        baTable.dragSort()
    })
})
</script>

<style scoped lang="scss">
.neir {
		padding:10px 10px;
		margin:auto;
		display: flex;
		align-items: center;
		color: black;
        
	}
    .neir span{
        display:inline-block;
    }
    .tou {
		padding: 0px 15px;
		border-radius: 10px;
		color: white;
		margin-left: 10px;
		font-weight: 600;
		line-height:45px;
	}
    .touguog{
		color: white;
		text-align: center;
		font-weight: 600;
		border-radius:10px;
		margin-left:10px;
        line-height:45px;
	}
    .tou2 {
		padding: 5px 5px;
		border-radius: 10px;
		color: white;
		font-weight: 600;

	}
</style>
