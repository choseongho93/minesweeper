// 지뢰판 만들기 

const tbody = document.querySelector("#table tbody");
let dataSet = [];
let stopFlag = false;
let openedOne = 0;

const codeTable = {
  open: -1, // 오픈 (클릭후)
  question: -2, // 지뢰 타일인지 아닌지 확신할 수 없을 때 사용(물음표)
  flag: -3, // 깃발(느낌표)
  mineFlag: -4, // 깃발로 지뢰 막음
  questionMine: -5, // 지뢰인 자리에 물음표
  mine: 1, // 지뢰
  ready: 0 // 준비 (클릭전)
};

// 실행 버튼 클릭 
document.querySelector("#exec").addEventListener("click", setStart);

// 시작하기 위해 세팅하는 함수
function setStart() {
  tbody.innerHTML = ""; // 화면 초기화

  // 데이터 set 초기화
  dataSet = [];
  stopFlag = false;
  openedOne = 0;
  document.querySelector("#result").textContent = '';

  const hor = parseInt(document.querySelector('#hor').value); // 가로 사각형 개수
  const ver = parseInt(document.querySelector('#ver').value); // 세로 사각형 개수
  const mine = parseInt(document.querySelector('#mine').value); // 지뢰 개수

  let candidates = Array(hor * ver) // 가로 * 세로해서 개수만큼 배열 인자 생성
  .fill() // 10*10이라면 100이므로, [undefined, ...., undefined] 100개의 undefined 요소가 있는 배열
  .map(function (num, index) {
    // undefined에 map을 사용해서 숫자 값을 대입
    return num = index;
  });

  let mixedNum = []; // 사각형에 지뢰가 숨어있는 랜덤한 숫자
  while (candidates.length > hor * ver - mine) {
    // 지뢰를 제외하고 나머지 사각형 개수를 랜덤하게 숫자 삽입
    let randomNum = candidates.splice(Math.floor(Math.random() * candidates.length), 1)[0];
    mixedNum.push(randomNum);
  }

  for (let i = 0; i < ver; i += 1) { // 세로 줄 갯수
    let arr = [];
    dataSet.push(arr);
    let tr = document.createElement('tr');

    for (let j = 0; j < hor; j += 1) { // 가로 줄 갯수
      arr.push(codeTable.ready); //처음에 0으로 세팅 (클릭전)
      let td = document.createElement('td');

      // 각 사각형 우클릭 했을때
      td.addEventListener('contextmenu', function (e) { 
        e.preventDefault();

        if (stopFlag) { // stopFlag validate
          return; // 함수 중단
        }

        // 칸 위치 찾기
        let parentTr = e.currentTarget.parentNode; // 우클릭한 하나의 사각형(td)의 부모 노드인 tr
        let parentTbody = e.currentTarget.parentNode.parentNode; // parentTr의 부모 노드인 tbody
        let rowSpot = Array.prototype.indexOf.call(parentTbody.children, tr); // parentTbody의 자식 노드 중 tr의 array의 인덱스 (td들 중에서 본인이 속한 td가 몇번쨰인지 확인)
        let colSpot = Array.prototype.indexOf.call(parentTr.children, e.currentTarget); // parentTr의 자식 노드 중 현재 타깃의 인덱스

        if (e.currentTarget.textContent === '' || e.currentTarget.textContent === 'X') { // 사각형의 값이 빈값(클릭 전)이거나, 지뢰인경우
          e.currentTarget.textContent = '⛳'; // 깃발로 표시
          e.currentTarget.classList.add('flag'); // class에 flag 추가

          if (dataSet[rowSpot][colSpot] === codeTable.mine) {// 지뢰인 경우
            dataSet[rowSpot][colSpot] = codeTable.mineFlag; // 정상적으로 지뢰를 막음(깃발).
          } else {
            dataSet[rowSpot][colSpot] = codeTable.flag;
          }
        } else if (e.currentTarget.textContent === '⛳') { // 깃발인 경우
          e.currentTarget.textContent = '?'; // 우클릭에서 깃발다음은 물음표이기에 물음표로 변경
          e.currentTarget.classList.remove('flag'); // class flag 추가된거 삭제
          e.currentTarget.classList.add('question'); // class question 추가

          if (dataSet[rowSpot][colSpot] === codeTable.mineFlag) { // 지뢰인 경우
            dataSet[rowSpot][colSpot] = codeTable.questionMine; // 지뢰인 자리이기에 물음표를 했기에 questionMine 값 -5
          } else {
            dataSet[rowSpot][colSpot] = codeTable.question; // 지뢰가 아닌 자리에 물음표는 question 값 -2
          }
        } else if (e.currentTarget.textContent === '?') { // 물음표인 경우
          e.currentTarget.classList.remove('question'); // class question 추가된거 삭제

          if (dataSet[rowSpot][colSpot] === codeTable.questionMine) {// 지뢰인 자리에 물음표인 경우
            e.currentTarget.textContent = 'X'; // 지뢰로 변경
            dataSet[rowSpot][colSpot] = codeTable.mine; // 지뢰 값으로 변경
          } else {
            e.currentTarget.textContent = ''; // 빈 값으로 변경
            dataSet[rowSpot][colSpot] = codeTable.ready; // 준비상태로 변경 (클릭전)
          }
        }
      });


      // 각 사각형 좌클릭 했을때
      td.addEventListener('click', function (e) {
        if (stopFlag) {
          return;
        }

        // 클릭 했을때 주변 지뢰 개수
        let parentTr = e.currentTarget.parentNode; // 좌클릭한 하나의 사각형(td)의 부모 노드인 tr
        let parentTbody = e.currentTarget.parentNode.parentNode; // parentTr의 부모 노드인 tbody
        let rowSpot = Array.prototype.indexOf.call(parentTbody.children, tr); // parentTbody의 자식 노드 중 tr의 array의 인덱스 (td들 중에서 본인이 속한 td가 몇번쨰인지 확인)
        let colSpot = Array.prototype.indexOf.call(parentTr.children, e.currentTarget); // parentTr의 자식 노드 중 현재 타깃의 인덱스

        // 성공했을때 전체 다 오픈되면 성공 
        if ([codeTable.open, codeTable.flag, codeTable.mineFlag, codeTable.questionMine, codeTable.question].includes(dataSet[rowSpot][colSpot])) {
          return;
        }

        e.currentTarget.classList.add('opened'); // 클릭 후 값으로 변경
        openedOne += 1; // 클릭 횟수

        if (dataSet[rowSpot][colSpot] === codeTable.mine) { // 지뢰를 선택한 경우
          e.currentTarget.textContent = '💣'; // 텍스트 변경
          document.querySelector('#result').textContent = '실패하였습니다.'; // 실패하였다고 텍스트 출력
          stopFlag = true; // 정지 플래그 true로 수정 (게임중단)
        } else { // 지뢰를 선택하지 않은 경우
          // mineSet은 선택한 사각형 기준으로 근처 8개 사각형의 상태 값을 배열로 저장
          let mineSet = [dataSet[rowSpot][colSpot - 1], dataSet[rowSpot][colSpot + 1]]; // 선택한 사각형을 기준으로 좌,우
          
          if (dataSet[rowSpot - 1]) { // 선택한 사각형 기준으로 바로 위 가로줄 
            mineSet = mineSet.concat(dataSet[rowSpot - 1][colSpot - 1], dataSet[rowSpot - 1][colSpot], dataSet[rowSpot - 1][colSpot + 1]); // 왼쪽 위대각선, 위, 오른쪽 위대각선
          }

          if (dataSet[rowSpot + 1]) { // 선택한 사각형 기준으로 바로 아래 가로줄
            mineSet = mineSet.concat(dataSet[rowSpot + 1][colSpot - 1], dataSet[rowSpot + 1][colSpot], dataSet[rowSpot + 1][colSpot + 1]); // 왼쪽 아래대각선, 아래, 오른쪽 아래대각선
          }

          let mineQty = mineSet.filter(function (el) { // 8개 근처에 지뢰가 있는 개수
            return [codeTable.mine, codeTable.mineFlag, codeTable.questionMine].includes(el);
          });

          e.currentTarget.textContent = mineQty.length || ''; // 지뢰 개수가 있으면 숫자 출력하고 없다면, 빈값 
          dataSet[rowSpot][colSpot] = codeTable.open; // 클릭 

          if (mineQty.length === 0) { // 근처 8칸 모두 지뢰가 없는경우 
            let clickAround = [];
            if (tbody.children[rowSpot - 1]) { // 윗줄
              clickAround = clickAround.concat([
                  tbody.children[rowSpot - 1].children[colSpot - 1], tbody.children[rowSpot - 1].children[colSpot], tbody.children[rowSpot - 1].children[colSpot + 1]
                ]);// 왼쪽 위대각선, 위, 오른쪽 위대각선
            }
            
            // 선택한 현재줄
            clickAround = clickAround.concat([tbody.children[rowSpot].children[colSpot - 1], tbody.children[rowSpot].children[colSpot + 1]]); // 좌,우

            if (tbody.children[rowSpot + 1]) {// 아래줄
              clickAround = clickAround.concat([tbody.children[rowSpot + 1].children[colSpot - 1], tbody.children[rowSpot + 1].children[colSpot], tbody.children[rowSpot + 1].children[colSpot + 1]]);
            } // 왼쪽 아래대각선, 아래, 오른쪽 아래대각선

            clickAround.filter(function (el) {
              return el = !!el;
            }).forEach(function (around) {
              let aroundTr = around.parentNode; // 부모 노드 
              let aroundTbody = around.parentNode.parentNode;
              let aroundRow = Array.prototype.indexOf.call(aroundTbody.children, tr);
              let aroundCol = Array.prototype.indexOf.call(aroundTr.children, around);

              if (dataSet[aroundRow][aroundCol] !== codeTable.open) { // 클릭하지 않은경우 
                around.click(); // 클릭 
              }
            });
          }
        }

        if (openedOne === hor * ver - mine) {
          stopFlag = true;
          document.querySelector('#result').textContent = '승리했습니다.';
        }
      });
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  // 지뢰 설치 
  for (let k = 0; k < mixedNum.length; k++) {
    let col = Math.floor(mixedNum[k] / ver);
    let row = mixedNum[k] % ver;
    // console.log(col, row);

    tbody.children[col].children[row].textContent = 'X';

    dataSet[col][row] = codeTable.mine;
  }
  // console.log(dataSet);
}