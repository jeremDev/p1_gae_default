/* eslint-disable */
import bi1_data_validation from '../../base_i1_datavalidation'
import { RC, CR, AJRS } from '../../base_i2_success_codes'
import base_i3_log from '../../base_i3_logging'
import { ajax } from 'noquery-ajax'

function assignNeedToNeeder(firebase_email, firebase_token, user_uid, needer_uid, need_uid, special_requests=null) {
  return new Promise(function (resolve, reject) {
    var return_msg = "";
    var debug_data = [];
    var call_result = {};
    var task_id = "p1s3t2AssignNeedToNeeder";
    var response_data = {};

    ///// input validation
    call_result = bi1_data_validation.is_email_address(firebase_email);
    debug_data.push(call_result);
    call_result = bi1_data_validation.is_string(firebase_token);
    debug_data.push(call_result);

    // TODO- Confirm format and add functions to base_i1_datavalidation
    // call_result = bi1_data_validation.is_user_uid(user_uid);
    // debug_data.push(call_result);
    // call_result = bi1_data_validation.is_need_uid(need_uid);
    // debug_data.push(call_result);
    // call_result = bi1_data_validation.is_needer_uid(needer_uid);
    // debug_data.push(call_result);

    if (special_requests !== null) {
      call_result = bi1_data_validation.is_string(special_requests);
      debug_data.push(call_result);
    }

    var validation_failed_flag = false;
    for (var index in debug_data) {
      if (debug_data[index][CR.success] !== RC.success) {
        validation_failed_flag = true;
        break;
      }
    }

    if (validation_failed_flag === true) {
      return_msg += "input validation failed";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      reject({ success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data, response_data: response_data });
      return;
    }
    /////</end> input validation

    ajax({
      url: 'https://p1s3-web-requests-dot-aqueous-choir-160420.appspot.com/p1s3t2-assign-need-to-needer',
      method: 'POST',
      data: {
        'p1s3_firebase_email': firebase_email,
        'p1s3_token': firebase_token,
        'p1s3t2_need_uid': need_uid,
        'p1s3t2_needer_uid': needer_uid,
        'p1s3t2_user_uid': user_uid,
        'p1s3t2_special_requests': special_requests
      },
      success: function (result) {
        response_data = result;
        resolve({ success: RC.success, return_msg: return_msg, debug_data: debug_data, response_data: response_data});
      },
      error: function (result) {
        return_msg += "failed to assign the need to needer, error data:" + JSON.stringify(result);
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.ajax_failure, return_msg, debug_data);
        reject({ success: RC.ajax_failure, return_msg: return_msg, debug_data: debug_data, response_data: response_data});
      }
    })
  });
};


export default assignNeedToNeeder