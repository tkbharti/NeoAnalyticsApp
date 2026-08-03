import {
  CFormSelect,   
} from '@coreui/react';

import { Trash2 }   from 'lucide-react';

export const AggregationColumn = ({ fieldlist, columnRef,  setcolumn}) => {  
  return (  
        <CFormSelect className="mb-1"   style={{float:'left', marginTop:'5px'}} 
            ref={columnRef} 
            defaultValue={setcolumn}
            onChange={(e)=>columnRef.current.value}
            id="saggcol"
            size="sm">
              {fieldlist && fieldlist.map((item,index)=>{ 
                return(
                  <option key={index} value={item}>{item}</option>
                )
              })} 
        </CFormSelect>  
  ); 
}
 
export const AggregationOf = ({ fieldlist,aggregationOfRef, setaggof }) => {  
  return (  
        <CFormSelect className="mb-1"   style={{float:'left', marginTop:'5px'}} 
            ref={aggregationOfRef} 
            defaultValue={setaggof}
            onChange={(e)=>aggregationOfRef.current.value}
            id="saggof"
            size="sm">
              {fieldlist && fieldlist.map((item,index)=>{ 
                return(
                  <option key={index} value={item}>{item}</option>
                )
              })} 
        </CFormSelect>  
  );  
};

export const AggregationSelector = ({ aggregationRef, setagg }) => { 
  return ( 
        <CFormSelect className="mb-1"   style={{float:'left', marginTop:'5px'}} 
            ref={aggregationRef} 
            defaultValue={setagg} 
            onChange={(e)=>aggregationRef.current.value}
            id="sagg"
            size="sm">
            <option  key={1} value="COUNT">COUNT</option>
            <option  key={2} value="SUM">SUM</option>
            <option  key={3} value="MIN">MIN</option>
            <option  key={4} value="MAX">MAX</option>
            <option  key={5} value="AVG">AVG</option>
        </CFormSelect> 
  );      
};

export const SizeSelector = ({sizeRef, setsize }) => {  
  return (  
        <CFormSelect className="mb-1"   style={{float:'left', marginTop:'5px'}} 
                ref={sizeRef} 
                defaultValue={setsize}
                onChange={(e)=> sizeRef.current.value}
                id="size"
                size="sm"> 
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="-1">All</option>
        </CFormSelect> 
  );      
};

export const OrderSelector = ({orderRef, orderby }) => {  
  return ( 
        <CFormSelect className="mb-1"   style={{float:'left', marginTop:'5px'}} 
                ref={orderRef} 
                defaultValue={orderby}
                onChange={(e)=> orderRef.current.value}
                id="order"
                size="sm"> 
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
        </CFormSelect> 
  );      
};

export const AddedFieldList = ({allagg, setId}) =>{ 
        const setRemoveItem = (ind)=>{
            setId(ind);
        }
        return ( 
            <table className="table" style={{width:'100%',fontSize:'12px'}}>
            <tbody>   
                <tr>
                    <th colSpan={3} style={{textAlign:'center'}}>Added List</th>
                </tr>
                <tr> 
                    <td>Column</td>
                    <td>Aggregation</td>
                    <td></td>
                </tr>
                {allagg && allagg.map((item,index)=>{ 
                    return( <tr key={index}>  
                        <td>{item.agg}</td> 
                        <td>{item.aggof}</td> 
                        <td><Trash2 size={14} onClick={()=>setRemoveItem(index)} /></td> 
                    </tr>) 
                })} 
            </tbody>
            </table>
        );
} 